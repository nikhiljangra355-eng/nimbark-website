// PATCH /api/enquiries/:id — admin-only status update (new | contacted | closed).
// Requires: Authorization: Bearer <ADMIN_TOKEN>

const ALLOWED_STATUSES = ['new', 'contacted', 'closed'];

function isAuthorized(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const header = req.headers.authorization || '';
  return header === `Bearer ${token}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'PATCH') {
    res.setHeader('Allow', 'PATCH');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  const { id } = req.query;
  if (!id || !/^[0-9a-z-]{1,64}$/i.test(String(id))) {
    return res.status(400).json({ success: false, error: 'Invalid enquiry id.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const status = String((body || {}).status || '').toLowerCase();
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, error: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}.` });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    return res.status(500).json({ success: false, error: 'Supabase is not configured.' });
  }

  try {
    const resp = await fetch(
      `${url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')}/rest/v1/enquiries?id=eq.${encodeURIComponent(id)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({ status }),
      }
    );
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      throw new Error(`Supabase update failed (${resp.status}): ${detail.slice(0, 300)}`);
    }
    const rows = await resp.json();
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'Enquiry not found.' });
    }
    return res.status(200).json({ success: true, enquiry: rows[0] });
  } catch (err) {
    console.error('Enquiry update failed:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to update enquiry.' });
  }
};
