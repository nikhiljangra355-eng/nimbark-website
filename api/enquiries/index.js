// GET /api/enquiries — admin-only list of all enquiries, newest first.
// Requires: Authorization: Bearer <ADMIN_TOKEN>

function isAuthorized(req) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const header = req.headers.authorization || '';
  return header === `Bearer ${token}`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, error: 'Method not allowed.' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized.' });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    return res.status(500).json({ success: false, error: 'Supabase is not configured.' });
  }

  try {
    const resp = await fetch(
      `${url.replace(/\/$/, '')}/rest/v1/enquiries?select=*&order=created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!resp.ok) {
      const detail = await resp.text().catch(() => '');
      throw new Error(`Supabase query failed (${resp.status}): ${detail.slice(0, 300)}`);
    }
    const enquiries = await resp.json();
    return res.status(200).json({ success: true, enquiries });
  } catch (err) {
    console.error('Enquiries fetch failed:', err.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch enquiries.' });
  }
};
