# How to Edit Your Website Yourself (No Coding Needed)

Your website works like this:

> **GitHub** (stores the website files) → **Vercel** (publishes them automatically)

Whenever you change a file on GitHub, Vercel republishes the site **automatically within
about 1 minute**. You never need to touch Vercel for content changes.

---

## Editing any file on GitHub (the only skill you need)

1. Go to **github.com** and log in → open your repository **`nimbark-website`**.
2. Click the file you want to change (see the cheat-sheet below for which file).
3. Click the **pencil icon (✏️)** at the top-right of the file view.
4. Make your change — edit only the **text between tags**, e.g. change
   `<h3>Old Heading</h3>` to `<h3>New Heading</h3>`. Don't delete the `<...>` parts.
5. Click the green **Commit changes** button → **Commit directly to the `main` branch** → Commit.
6. Wait ~1 minute, then refresh your website. Done!

**Tip:** to find text quickly, open the file and press `Ctrl+F`, or use the search box
at the top of GitHub and search the exact words you see on the website.

**Made a mistake?** On GitHub open the file → **History** (top right) → click the old
version → copy back what you need. Nothing is ever lost.

---

## Cheat-sheet: what lives in which file

| What you want to change | File to edit |
|---|---|
| Home page: headlines, stats numbers (500+, 5+ …), services text, testimonials, steps | `index.html` |
| Testimonial names/quotes | `index.html` — search for `class="who"` |
| Stats numbers | `index.html` — search for `data-count` and change the number (it animates automatically) |
| About page text | `about.html` |
| FAQ questions/answers | `faq.html` |
| Contact page details | `contact.html` |
| A specific service page | `services/<service-name>.html` (e.g. `services/phd-thesis.html`) |
| Articles | files inside `resources/` |
| **Phone numbers / email / address shown in header, footer, buttons** | `site.js` — the settings are at the very top (`WHATSAPP`, `PHONE_DISPLAY`, `PHONE_TEL`, `EMAIL`). Also check `index.html` & `contact.html` for the same numbers in page text |
| Colors and fonts | `styles.css` — brand colors are at the top under `:root` |
| Logo | replace `assets/logo.svg` / `assets/logo.png` (upload via GitHub: **Add file → Upload files**) |

## Things managed in other dashboards (not files)

| What | Where |
|---|---|
| See/manage enquiries | your website `/admin` (login with your ADMIN_TOKEN) |
| Enquiry database | supabase.com → your project → Table Editor → `enquiries` |
| Email sending & domain verification | resend.com |
| Custom domain, environment variables (`ADMIN_TOKEN`, `NOTIFY_EMAIL`, `EMAIL_FROM`, Supabase keys) | vercel.com → your project → Settings. **After changing env variables, always click Deployments → ⋯ → Redeploy** |
| Site not updating / errors | vercel.com → Deployments (check latest is "Ready"); also open `/api/health` on your site |

---

## Getting AI help without a paid subscription

Any AI assistant can help you edit this site — the free tiers of Claude (claude.ai),
ChatGPT, or Gemini are enough for small text changes. The magic phrase to use:

> "My website is a static HTML site on GitHub, deployed on Vercel. I want to change
> ____ . Here is the current code from the file `____`: (paste the file or section).
> Give me the exact edited code to paste back."

Copy the relevant file's content from GitHub, paste it to the AI with that prompt,
paste the answer back via the pencil-edit flow above, commit — done.
