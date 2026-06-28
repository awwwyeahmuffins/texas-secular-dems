# Secular Democrats of Texas — website

A fast, free-to-host website for the Secular Democrats of Texas caucus, built with
[Astro](https://astro.build) and editable in the browser via
[Decap CMS](https://decapcms.org). It replaces the old `seculartexasdem.wordpress.com`
site and is modeled on the look and structure of `seculardems.org`.

- **Hosting:** Cloudflare Pages (free tier — no monthly cost, free SSL)
- **Editing:** Volunteers edit content at `/admin` (no code required)
- **Cost:** $0/month hosting; only a custom domain (~$10–15/yr) is optional

---

## Run it locally

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build to ./dist
npm run preview    # preview the production build
```

To use the CMS against your local files while developing:

```bash
npx decap-server   # in one terminal
npm run dev        # in another, then open http://localhost:4321/admin
```

## How the site is organized

| What | Where |
| --- | --- |
| Pages (About, subpages, Successes) | `src/content/pages/**/*.md` |
| Events | `src/content/events/*.md` |
| Endorsements | `src/content/endorsements/*.md` |
| Global settings (donate URL, email, social, nav) | `src/data/site.json` |
| Layout & components | `src/layouts/`, `src/components/` |
| Styles / colors | `src/styles/global.css` (palette at the top) |
| CMS admin | `public/admin/` |

Content edits (in the CMS or in these files) trigger a rebuild and republish automatically.

---

## Deploy to Cloudflare Pages

1. Push this repo to GitHub.
2. In the Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. The site goes live at `https://<project>.pages.dev`.

## Custom domain

The site uses **`seculartexasdem.com`** (apex + `www`), served via Cloudflare Pages.
Both are attached to the Pages project and point at `texas-secular-dems.pages.dev`
through proxied CNAME records; Cloudflare provisions SSL automatically.
`site:` in `astro.config.mjs` is set to `https://seculartexasdem.com` for sitemap/SEO.

---

## Enable browser editing (Decap CMS auth)

Decap needs an OAuth helper so editors can log in with GitHub. This repo ships that helper
built in — the two Cloudflare Pages Functions in `functions/` (`auth.js` and `callback.js`)
handle the login on the **same domain** as the site, so there's no separate worker to deploy.
One-time setup:

1. **Push the repo to GitHub** and connect it to Cloudflare Pages (see "Deploy" above).
2. **Create a GitHub OAuth App** — GitHub → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: your live site URL (e.g. `https://seculartexasdem.com`)
   - Authorization callback URL: `https://<your-site>/callback`
   - Note the **Client ID** and generate a **Client Secret**.
3. **Add the secrets to Cloudflare Pages** — your Pages project → Settings → Environment
   variables (Production *and* Preview):
   - `GITHUB_CLIENT_ID` = the Client ID
   - `GITHUB_CLIENT_SECRET` = the Client Secret (mark as a secret/encrypted)
   - Redeploy so the functions pick them up.
4. **Point the CMS at your repo/domain** — in `public/admin/config.yml`:
   - `backend.repo` → `your-github-owner/your-repo`
   - `backend.base_url` → your live site origin (e.g. `https://seculartexasdem.com`)
5. Editors go to `/admin`, click **Login with GitHub**, and can edit content. Each editor needs
   write access to the GitHub repo (or review access via the `editorial_workflow`).

> Until steps 2–4 are done, `/admin` loads but login won't complete. Local editing via
> `npx decap-server` + `npm run dev` works without any of this.

---

## Things to update before launch

- **ActBlue donate link** — `donateUrl` in `src/data/site.json` is a placeholder
  (`https://secure.actblue.com/`). Replace with the caucus's real ActBlue page.
- **Domain** — register it and wire it up (above), then update `astro.config.mjs`.
- **By-Laws** — `src/content/pages/about/by-laws.md` is a placeholder; paste the full text.
- **Endorsements & Events** — current entries are from the 2022 cycle; refresh as needed.
- **Social handles** — confirm the X/Twitter and Facebook links in `site.json` are current.
