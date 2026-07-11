# Nimbark Research Insights — Company Website

Official website for **Nimbark Research Insights** — *Searching & Researching for Knowledge*.

Full-stack site built for **Vercel**:

- **Frontend** — fast, responsive, SEO-optimised static pages (no framework, no build step)
- **Backend** — Vercel serverless functions (`/api`) with **Supabase** (enquiry database) and **Resend** (email notifications + auto-replies)
- **Admin dashboard** at `/admin` to view and manage enquiries

## Project structure

```
index.html                  Home page
about.html                  About page
contact.html                Contact page (form + Google Map)
faq.html                    FAQ (10 Q&As, accordion)
services/                   Services index + 9 individual service pages
resources/                  Guides index + 4 full articles
admin/index.html            Admin dashboard (token login)
styles.css                  All styling
site.js                     Shared header/footer/modal + interactions
api/enquiry.js              POST  /api/enquiry        (all forms submit here)
api/enquiries/index.js      GET   /api/enquiries      (admin only)
api/enquiries/[id].js       PATCH /api/enquiries/:id  (admin only)
supabase-setup.sql          Database table setup
vercel.json                 Clean URLs + security headers
.env.example                Required environment variables
public/logo.png             Logo (PNG)
assets/                     Logo + favicon (SVG)
sitemap.xml, robots.txt     SEO
```

## Deployment — step by step (beginner friendly)

### Step 1 — Create a free Supabase project (the enquiry database)

1. Go to [supabase.com](https://supabase.com) → **Start your project** → sign up (free).
2. Click **New project**, give it any name (e.g. `nimbark-website`), set a database password, choose the Mumbai region, and create it.
3. When the project is ready, open **SQL Editor** (left sidebar) → **New query**.
4. Copy the entire contents of [`supabase-setup.sql`](./supabase-setup.sql) from this repo, paste it in, and press **Run**. You should see "Success".
5. Collect two values (you'll need them in Step 3):
   - **Project Settings → Data API** → copy the **Project URL** (looks like `https://abcdefgh.supabase.co`)
   - **Project Settings → API Keys** → copy the **`service_role`** secret key (⚠️ not the `anon` key)

### Step 2 — Get a free Resend API key (the email sender)

1. Go to [resend.com](https://resend.com) → sign up (free tier: 100 emails/day).
2. Open **API Keys** → **Create API Key** → copy the key (starts with `re_`).
3. *(Optional but recommended later)*: In **Domains**, add and verify `nimbarkinsights.com` so emails send from your own address. Until then, emails send from Resend's default sender and everything still works.

### Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → sign up with your GitHub account (free).
2. Click **Add New → Project** → **Import** this repository (`nimbark-website`).
3. Leave all build settings at their defaults (Framework preset: **Other**; no build command needed).
4. Expand **Environment Variables** and add these four:

   | Name | Value |
   |---|---|
   | `SUPABASE_URL` | your Supabase Project URL from Step 1 |
   | `SUPABASE_SERVICE_KEY` | your Supabase `service_role` key from Step 1 |
   | `RESEND_API_KEY` | your Resend key from Step 2 |
   | `ADMIN_TOKEN` | any long random password you invent — this is your `/admin` login |

5. Click **Deploy**. In about a minute your site is live at `https://<project>.vercel.app`.

### Step 4 — Test everything

1. Open the live site → click **Get Free Consultation** → submit the form.
2. You should see a green success message, receive a notification email at `info@nimbarkinsights.com`, and the enquirer receives an auto-reply.
3. Open `https://<your-site>/admin` → log in with your `ADMIN_TOKEN` → the enquiry appears in the table. Try changing its status.

> Note: if you haven't verified your domain in Resend yet, Resend's free sender can only email the address you signed up with. Enquiries are **always saved to Supabase** regardless — email is a bonus layer.

### Step 5 — Connect www.nimbarkinsights.com

1. In Vercel: your project → **Settings → Domains** → **Add** → enter `www.nimbarkinsights.com` (also add `nimbarkinsights.com`; Vercel will redirect it to www).
2. Vercel shows you DNS records. Log in to wherever you bought the domain (GoDaddy, Hostinger, etc.) and add them:
   - `www` → **CNAME** → `cname.vercel-dns.com`
   - root/`@` → **A** → `76.76.21.21`
3. Wait for DNS to propagate (minutes to a few hours). Vercel issues the HTTPS certificate automatically.

## Local development

```sh
npm i -g vercel     # once
vercel dev          # runs the site + API at http://localhost:3000
```

Create a `.env` file (copy `.env.example`) for local API testing. Never commit `.env`.

## Notes for maintainers

- **All enquiry forms** (contact page + the site-wide modal) POST to `/api/enquiry`, which validates (Indian 10-digit phone, email), applies rate limiting (5 per IP per hour, in-memory per serverless instance), a honeypot bot trap, saves to Supabase, and sends both emails via Resend.
- **Admin endpoints** require the `Authorization: Bearer <ADMIN_TOKEN>` header.
- The site uses **clean URLs** (`/services/phd-thesis` serves `services/phd-thesis.html`) via `vercel.json`.
- To change contact numbers or add a service, edit the constants at the top of `site.js` plus the relevant pages, and keep `sitemap.xml` in sync.
