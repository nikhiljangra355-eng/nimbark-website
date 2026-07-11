// POST /api/enquiry — handles all website forms (contact page + consultation modal).
// Validates input, applies rate limiting, saves to Supabase, and sends
// notification + auto-reply emails via Resend. No npm dependencies (uses fetch).

const RATE_LIMIT = 5;               // submissions
const RATE_WINDOW_MS = 60 * 60 * 1000; // per hour
const rateBuckets = new Map();      // in-memory; per serverless instance

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  return (Array.isArray(fwd) ? fwd[0] : (fwd || '')).split(',')[0].trim() ||
    req.socket?.remoteAddress || 'unknown';
}

function isRateLimited(ip) {
  const now = Date.now();
  const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) {
    rateBuckets.set(ip, hits);
    return true;
  }
  hits.push(now);
  rateBuckets.set(ip, hits);
  // Prevent unbounded growth across many IPs
  if (rateBuckets.size > 5000) {
    for (const [key, times] of rateBuckets) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) rateBuckets.delete(key);
    }
  }
  return false;
}

function validate(body) {
  const errors = [];
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phoneRaw = String(body.phone || '').trim();
  const service = String(body.service || '').trim().slice(0, 120);
  const message = String(body.message || '').trim().slice(0, 5000);

  if (name.length < 2 || name.length > 100) errors.push('Please enter your full name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('Please enter a valid email address.');

  // Accept +91 / 91 / 0 prefixes, spaces and dashes; require a 10-digit Indian mobile number.
  // Only strip a prefix when the length shows it really is one — "9123456789" is a valid
  // 10-digit number that must NOT lose its leading "91".
  let digits = phoneRaw.replace(/[\s\-()]/g, '');
  if (digits.startsWith('+91')) digits = digits.slice(3);
  else if (digits.startsWith('91') && digits.length === 12) digits = digits.slice(2);
  else if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);
  if (!/^[6-9]\d{9}$/.test(digits)) errors.push('Please enter a valid 10-digit Indian mobile number.');

  return { errors, data: { name, email, phone: digits, service, message } };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function saveToSupabase(data) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_KEY missing).');

  const res = await fetch(`${url.replace(/\/$/, '')}/rest/v1/enquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service || null,
      message: data.message || null,
      status: 'new',
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Supabase insert failed (${res.status}): ${detail.slice(0, 300)}`);
  }
  const rows = await res.json();
  return rows[0];
}

async function sendEmail({ to, subject, html, replyTo }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { skipped: true };
  const from = process.env.EMAIL_FROM || 'Nimbark Research Insights <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ from, to: [to], subject, html, ...(replyTo ? { reply_to: replyTo } : {}) }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(`Resend send failed (${res.status}): ${detail.slice(0, 300)}`);
    return { failed: true };
  }
  return res.json();
}

function notificationHtml(d) {
  const row = (label, value) =>
    `<tr><td style="padding:8px 14px;font-weight:600;color:#1e4620;white-space:nowrap;vertical-align:top;">${label}</td>` +
    `<td style="padding:8px 14px;color:#233024;">${value || '<em>—</em>'}</td></tr>`;
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e4e9e4;border-radius:12px;overflow:hidden;">
    <div style="background:#1e4620;color:#ffffff;padding:18px 24px;">
      <h2 style="margin:0;font-size:18px;">📩 New Website Enquiry</h2>
      <p style="margin:4px 0 0;color:#c8d6c8;font-size:13px;">Nimbark Research Insights — www.nimbarkinsights.com</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;background:#ffffff;">
      ${row('Name', escapeHtml(d.name))}
      ${row('Phone', `<a href="tel:+91${d.phone}">${d.phone}</a> &nbsp;·&nbsp; <a href="https://wa.me/91${d.phone}">WhatsApp</a>`)}
      ${row('Email', `<a href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a>`)}
      ${row('Service', escapeHtml(d.service))}
      ${row('Message', escapeHtml(d.message).replace(/\n/g, '<br/>'))}
      ${row('Received', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST')}
    </table>
    <div style="background:#fbf8f2;padding:12px 24px;font-size:12px;color:#5b6a5e;">
      Reply directly to this email to reach the enquirer, or manage all enquiries in the admin dashboard.
    </div>
  </div>`;
}

function autoReplyHtml(d) {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e4e9e4;border-radius:12px;overflow:hidden;">
    <div style="background:#1e4620;color:#ffffff;padding:22px 24px;">
      <h2 style="margin:0;font-size:20px;">Nimbark Research Insights</h2>
      <p style="margin:4px 0 0;color:#f7c948;font-size:13px;">Searching &amp; Researching for Knowledge</p>
    </div>
    <div style="padding:24px;color:#233024;font-size:14px;line-height:1.7;background:#ffffff;">
      <p>Dear ${escapeHtml(d.name)},</p>
      <p>Thank you for contacting <strong>Nimbark Research Insights</strong>. We have received your enquiry${d.service ? ` regarding <strong>${escapeHtml(d.service)}</strong>` : ''} and one of our research advisors will get back to you <strong>within 24 hours</strong>.</p>
      <p>If your requirement is urgent, you can reach us right away:</p>
      <p style="margin:16px 0;">
        📞 <strong>Call:</strong> <a href="tel:+919588142496" style="color:#2d6a30;">95881-42496</a><br/>
        💬 <strong>WhatsApp:</strong> <a href="https://wa.me/919996667152" style="color:#2d6a30;">99966-67152</a><br/>
        📍 <strong>Office:</strong> #1639/12, Ground Floor, Opp. 3rd Gate KUK, Kurukshetra, Haryana
      </p>
      <p>Your details are kept strictly confidential and are never shared with third parties.</p>
      <p>Warm regards,<br/><strong>Team Nimbark Research Insights</strong></p>
    </div>
    <div style="background:#fbf8f2;padding:12px 24px;font-size:12px;color:#5b6a5e;">
      This is an automated acknowledgement of your enquiry at www.nimbarkinsights.com.
    </div>
  </div>`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: bots fill the hidden "website" field. Pretend success, store nothing.
  if (String(body.website || '').trim() !== '') {
    return res.status(200).json({ success: true });
  }

  if (isRateLimited(clientIp(req))) {
    return res.status(429).json({
      success: false,
      error: 'Too many enquiries from your network. Please try again after an hour, or call us at 95881-42496.',
    });
  }

  const { errors, data } = validate(body);
  if (errors.length) {
    return res.status(400).json({ success: false, error: errors.join(' ') });
  }

  // The enquiry succeeds if it reaches the business by EITHER channel:
  // saved to Supabase OR delivered by notification email. This keeps the
  // form working even while one of the integrations is not yet configured.
  let saved = false;
  try {
    await saveToSupabase(data);
    saved = true;
  } catch (err) {
    console.error('Enquiry save failed (check SUPABASE_URL / SUPABASE_SERVICE_KEY and that supabase-setup.sql was run):', err.message);
  }

  const subjectPrefix = saved ? '' : '[NOT SAVED TO DATABASE] ';
  const results = await Promise.allSettled([
    sendEmail({
      to: 'info@nimbarkinsights.com',
      subject: `${subjectPrefix}New enquiry from ${data.name}${data.service ? ` — ${data.service}` : ''}`,
      html: notificationHtml(data),
      replyTo: data.email,
    }),
    sendEmail({
      to: data.email,
      subject: 'We received your enquiry — Nimbark Research Insights',
      html: autoReplyHtml(data),
    }),
  ]);
  results.forEach((r) => {
    if (r.status === 'rejected') console.error('Email error:', r.reason);
  });
  const notification = results[0];
  const notified = notification.status === 'fulfilled' &&
    notification.value && !notification.value.failed && !notification.value.skipped;

  if (saved || notified) {
    return res.status(200).json({ success: true });
  }

  console.error('Enquiry lost: database save failed AND notification email failed/not configured. Visit /api/health for a configuration report.');
  return res.status(500).json({
    success: false,
    error: 'We could not receive your enquiry right now.',
  });
};
