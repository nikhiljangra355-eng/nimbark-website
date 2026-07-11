// GET /api/health — configuration self-check for the site owner.
// Reports whether each integration is configured and reachable.
// Exposes only true/false and status words — never keys or data.

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const report = {
    env: {
      SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
      SUPABASE_SERVICE_KEY: Boolean(process.env.SUPABASE_SERVICE_KEY),
      RESEND_API_KEY: Boolean(process.env.RESEND_API_KEY),
      ADMIN_TOKEN: Boolean(process.env.ADMIN_TOKEN),
    },
    database: 'not_configured',
    hint: '',
  };

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (url && key) {
    try {
      const resp = await fetch(
        `${url.replace(/\/$/, '')}/rest/v1/enquiries?select=id&limit=1`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (resp.ok) {
        report.database = 'ok';
      } else if (resp.status === 404) {
        report.database = 'table_missing';
        report.hint = 'The "enquiries" table does not exist. Open Supabase → SQL Editor and run supabase-setup.sql from the repository.';
      } else if (resp.status === 401 || resp.status === 403) {
        report.database = 'auth_failed';
        report.hint = 'SUPABASE_SERVICE_KEY is wrong. Use the service_role secret key from Supabase → Project Settings → API Keys (not the anon key).';
      } else {
        report.database = `error_${resp.status}`;
        report.hint = 'Supabase returned an unexpected error. Check SUPABASE_URL points to your project (https://YOUR-REF.supabase.co).';
      }
    } catch (err) {
      report.database = 'unreachable';
      report.hint = 'Could not reach Supabase. Check that SUPABASE_URL is exactly your Project URL from Supabase → Project Settings → Data API.';
    }
  } else {
    report.hint = 'Add the missing environment variables in Vercel → Project → Settings → Environment Variables, then REDEPLOY (Deployments → ⋯ → Redeploy). Env vars only take effect after a new deployment.';
  }

  const healthy = report.database === 'ok';
  return res.status(healthy ? 200 : 503).json({ healthy, ...report });
};
