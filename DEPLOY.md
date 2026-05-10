# Deploying reyadhasnain.com to Vercel

End-to-end walkthrough — from local repo to live site at `https://reyadhasnain.com`. Should take ~15 minutes.

---

## Prerequisites

You'll need accounts on:

- **Vercel** — [vercel.com](https://vercel.com) (free tier covers this site)
- **GitHub** (or GitLab / Bitbucket) — to host the code Vercel pulls from
- **A domain registrar** — wherever `reyadhasnain.com` is registered, you'll need DNS access
- **An SMTP provider** — for the contact form. Easiest: Gmail with an App Password (free, instant). See [.env.example](.env.example) for alternatives.

---

## 1. Push the code to GitHub

```bash
# From the project root
git init
git add .
git commit -m "Initial commit"

# Create a private GitHub repo and push
gh repo create reyadhasnain-website --private --source=. --push
# Or manually: create the repo on github.com, then:
#   git remote add origin git@github.com:<you>/reyadhasnain-website.git
#   git branch -M main && git push -u origin main
```

---

## 2. Import the project into Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Add New → Project** and select your `reyadhasnain-website` repo.
3. Vercel auto-detects Astro. **Don't change** the framework preset, build command, or output directory.
4. **Stop** before clicking **Deploy** — first add the env vars (next step).

---

## 3. Set environment variables

In the Vercel project import screen (or later under **Settings → Environment Variables**), paste each of the following. Tick **Production**, **Preview**, and **Development** for each so the same value applies everywhere.

| Name | Value | Notes |
|---|---|---|
| `PUBLIC_SITE_URL` | `https://reyadhasnain.com` | Once your custom domain is wired (step 6). Until then, use the `*.vercel.app` URL. |
| `SMTP_HOST` | `smtp.gmail.com` | Or your provider's host — see [.env.example](.env.example) |
| `SMTP_PORT` | `465` | |
| `SMTP_SECURE` | `true` | |
| `SMTP_USER` | your Gmail address | |
| `SMTP_PASS` | your 16-char Gmail **App Password** | NOT your Gmail login password — generate at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) |
| `MAIL_TO` | `reyad@smart-lab.biz` | Where contact-form messages go |
| `MAIL_FROM` | `Reyad Hasnain Website <noreply@reyadhasnain.com>` | What recipients see in their inbox |
| `RATE_LIMIT_PER_MIN` | `5` | Per-IP cap to defeat spam loops |

---

## 4. Click **Deploy**

Vercel installs deps, runs `astro build`, and pushes the result to its edge network. First build takes ~2 minutes; subsequent builds are faster (cached).

When done, you'll get a URL like `https://reyadhasnain-website-xyz.vercel.app`. Open it and verify:

- [ ] Home page loads, hero animation runs
- [ ] All 9 nav routes return 200 (`/about`, `/experience`, `/policy`, `/thought-leadership`, `/insights`, `/speaking`, `/media-kit`, `/contact`)
- [ ] Theme toggle (top-right of header) flips dark ↔ light, **and persists across navigations**
- [ ] Submit the contact form with a test message → arrives at `reyad@smart-lab.biz` within 5 seconds, plus an auto-reply lands at the test sender's address
- [ ] OG image renders: `https://<your-vercel-url>/og.png?title=Test&path=/about` should download a 1200×630 PNG
- [ ] `/llms.txt` and `/robots.txt` and `/sitemap-index.xml` all return content

---

## 5. (Optional but recommended) Test the LinkedIn / Twitter share preview

Vercel's deployment URL is publicly accessible, so you can test OG cards before wiring the real domain:

- Twitter/X: paste the URL into [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator)
- LinkedIn: paste into [linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)
- Facebook: [developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)

Each should fetch the dynamic OG image and show Reyad Hasnain's headline + the page title.

---

## 6. Wire your custom domain

In Vercel: **Project → Settings → Domains → Add Domain → `reyadhasnain.com`**.

Vercel will tell you exactly which DNS records to add at your registrar. There are two common shapes:

**A) Apex domain (`reyadhasnain.com`):**
- Add an `A` record pointing to `76.76.21.21`

**B) www subdomain (`www.reyadhasnain.com`):**
- Add a `CNAME` record pointing to `cname.vercel-dns.com`

(Set up both — Vercel will auto-redirect www ↔ apex according to your preference.)

DNS changes propagate in 5–60 minutes. Vercel auto-issues a Let's Encrypt SSL certificate once it sees the records.

After the domain is live, **come back to Settings → Environment Variables** and update `PUBLIC_SITE_URL` to `https://reyadhasnain.com`. Click **Redeploy** on the latest deployment to apply (canonical tags, OG URLs, sitemap will all update).

---

## 7. Continuous deployment

From now on:

- Push to `main` → auto-deploys to **production** (the live `reyadhasnain.com`)
- Push to any other branch → auto-deploys to a unique **preview URL** (great for reviewing changes before merging)
- Open a Pull Request → Vercel comments the preview URL on it

You don't have to do anything else — Vercel watches the GitHub repo automatically.

---

## Architecture notes (for future tweaks)

- **Static-first:** every page in [src/pages/](src/pages/) prerenders to HTML at build time. Two routes opt out via `export const prerender = false;`:
  - [src/pages/api/contact.ts](src/pages/api/contact.ts) — runs as a Vercel **serverless function** for SMTP outbound
  - [src/pages/og.png.ts](src/pages/og.png.ts) — runs as a Vercel function for dynamic OG image generation, with ISR (24h cache + stale-while-revalidate)
- **Function region:** pinned to `sin1` (Singapore) in [vercel.json](vercel.json) — closest Vercel region to Dhaka. Change to `iad1` (US East) or `fra1` (Europe) by editing `vercel.json` if your audience shifts.
- **Static asset caching:** [vercel.json](vercel.json) sets `Cache-Control: max-age=31536000, immutable` for `/_astro/*` (Astro's hashed bundles), and `max-age=2592000, stale-while-revalidate=604800` for `/images/*`. Update `/api/*` is set to `no-store` so the contact endpoint never gets cached.
- **Security headers:** baseline `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security` (HSTS preload-eligible) all set in `vercel.json`.

---

## Cost expectations

- **Hobby plan (free):** 100 GB bandwidth/month, 100k function invocations, 100 GB-hours compute. This site uses well under all three at any sane traffic level.
- **Vercel Web Analytics:** free, privacy-friendly, no cookie banner needed. Already enabled in [astro.config.mjs](astro.config.mjs).
- **Bandwidth-heavy?** If Reyad ever goes viral and exceeds 100 GB, the Pro plan ($20/mo) covers 1 TB and removes the function-time limits.

---

## Rollback

If a deploy goes wrong:

- Vercel **Deployments** tab → click any previous deployment → **Promote to Production**. Live site reverts in seconds.
- Or revert the offending commit on `main` and push — Vercel auto-deploys the revert.

---

## Removing the Vercel-only setup later

If you ever decide to leave Vercel (Cloudflare Pages, Railway, Render, your own VPS), the changes are localised:

1. `npm install @astrojs/<new-adapter>` and `npm uninstall @astrojs/vercel`
2. Update `adapter:` in [astro.config.mjs](astro.config.mjs)
3. Delete [vercel.json](vercel.json) and `.vercel/`
4. Migrate the env vars to the new host

The application code itself is host-agnostic — only the adapter needs swapping.
