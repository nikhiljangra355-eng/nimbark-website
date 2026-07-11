# Nimbark Research Insights — Company Website

Official website for **Nimbark Research Insights** — *Searching & Researching for Knowledge*.

A fast, responsive, single-page static website. No build step, no framework, no backend — it can be hosted anywhere (GitHub Pages, Netlify, Vercel, or any web host).

## Structure

```
index.html        Main page (all sections)
styles.css        All styling (brand colors, responsive layout)
script.js         Mobile nav, scroll highlighting, WhatsApp contact form
assets/logo.svg   Company logo (stylized tree)
assets/favicon.svg
```

## Sections

- **Hero** — headline, tagline, call-to-action, key stats
- **About** — company intro, mission, key highlights
- **Services** — all 12 core services with icons
- **Publications** — UGC-CARE, Scopus, SCI, Web of Science
- **Why Us** — 4-step process
- **Contact** — phone, WhatsApp, email, address + enquiry form

## Contact form

The enquiry form has no backend: on submit it opens WhatsApp (99966-67152) with the visitor's details pre-filled. No visitor data is stored.

## Local preview

Open `index.html` directly in a browser, or serve locally:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Repository **Settings → Pages**
2. Source: *Deploy from a branch*, select the branch, folder `/ (root)`
3. Save — the site will be live at `https://<username>.github.io/nimbark-website/`

To use the custom domain **www.nimbarkinsights.com**, add it under Settings → Pages → Custom domain and point the domain's DNS (CNAME record) at GitHub Pages.
