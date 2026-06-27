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

## Add the custom domain

1. Register a domain (e.g. `texasseculardems.org`) — **check availability first**; it is
   referenced by the national org, so you may need an alternative such as `seculartexasdems.org`.
2. In Cloudflare Pages → your project → **Custom domains → Set up a domain**, enter it and
   follow the DNS steps. Cloudflare provisions SSL automatically.
3. Update `site:` in `astro.config.mjs` to the final domain (for correct sitemap/SEO URLs).

---

## Enable browser editing (Decap CMS auth)

Decap needs a small OAuth helper so editors can log in with GitHub. On Cloudflare the
one-time setup is:

1. **GitHub OAuth App** — GitHub → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: your site URL
   - Authorization callback URL: `https://<your-oauth-worker>/callback`
   - Note the **Client ID** and **Client Secret**.
2. **Deploy an OAuth worker** — use a maintained Cloudflare Worker OAuth provider for Decap
   (e.g. `cloudflare-pages-decap-oauth` / `decap-cms-cloudflare-pages-oauth`), setting the
   Client ID and Secret as environment variables. It deploys to
   `https://decap-oauth.<you>.workers.dev`.
3. **Point the CMS at it** — in `public/admin/config.yml` set:
   - `backend.repo` → `your-github-owner/your-repo`
   - `backend.base_url` → your worker URL
4. Editors then go to `/admin`, click **Login with GitHub**, and can edit content. They each
   need write access (or `editorial_workflow` review access) to the GitHub repo.

> Until the OAuth worker is configured, `/admin` loads but login won't complete. Local editing
> via `npx decap-server` works without any of this.

---

## Things to update before launch

- **ActBlue donate link** — `donateUrl` in `src/data/site.json` is a placeholder
  (`https://secure.actblue.com/`). Replace with the caucus's real ActBlue page.
- **Domain** — register it and wire it up (above), then update `astro.config.mjs`.
- **By-Laws** — `src/content/pages/about/by-laws.md` is a placeholder; paste the full text.
- **Endorsements & Events** — current entries are from the 2022 cycle; refresh as needed.
- **Social handles** — confirm the X/Twitter and Facebook links in `site.json` are current.
