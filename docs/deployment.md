# Deployment Guide

The app is a single self-contained `public/index.html` file (~500KB). It can be run locally, hosted on any static file server, or deployed to any CDN — no server-side processing required.

---

## Option 1: Local File (Simplest)

```bash
# Mac
open public/index.html

# Windows
start public/index.html

# Linux
xdg-open public/index.html
```

Or just double-click `public/index.html` in your file manager.

No server, no install. Works entirely offline except for AI API calls.

---

## Option 2: Local Dev Server

Useful during development to avoid `file://` protocol quirks with some browsers.

```bash
# Python (built-in on Mac/Linux)
python3 -m http.server 8080 --directory public
# → http://localhost:8080

# Node.js (npx, no install)
npx serve public -l 8080
# → http://localhost:8080

# npm script (from repo root)
npm run serve
```

### Building from Source

If you've edited source files in `src/`, rebuild before serving:

```bash
node build.mjs
# → public/index.html rebuilt
```

---

## Option 3: GitHub Pages

1. Push the repo to GitHub
2. Go to repo → **Settings** → **Pages**
3. Set source: `main` branch, `/public` folder
4. Save — GitHub Pages will publish automatically

Access at: `https://yourusername.github.io/repository-name`

No build step needed — `public/index.html` is already self-contained.

> **Shareable URLs work on GitHub Pages.** The `?zip=&industry=&radius=` URL params are handled client-side, so `https://yourusername.github.io/repo/?zip=30097&industry=daycare` loads correctly.

---

## Option 4: Netlify (1-Click)

**Via UI:**
1. Drag-and-drop the `public/` folder to [netlify.com/drop](https://netlify.com/drop)

**Via Git:**
1. Connect your GitHub repo
2. Set build settings:

```
Build command:     node build.mjs
Publish directory: public
```

**Via Netlify CLI:**
```bash
netlify deploy --dir=public --prod
```

---

## Option 5: Vercel

1. Connect your GitHub repo to Vercel
2. Set:
```
Framework preset: Other
Output directory: public
Build command:    node build.mjs
```

Or deploy with the CLI:
```bash
vercel --prod
```

---

## Option 6: AWS S3 Static Website

```bash
# Sync public/ folder to S3 bucket
aws s3 sync public/ s3://your-bucket-name --acl public-read

# Enable static website hosting
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html

# (Optional) Front with CloudFront for HTTPS + CDN
```

Access at: `http://your-bucket-name.s3-website-region.amazonaws.com`

---

## Option 7: Azure Static Web Apps / GCP Firebase Hosting

**Azure:**
```bash
az staticwebapp create --name my-biz-planner --source public/
```

**Firebase:**
```bash
firebase init hosting   # set public directory to "public"
firebase deploy
```

---

## CORS Note

When running from a local `file://` URL, direct API calls to Anthropic require:
```
anthropic-dangerous-direct-browser-access: true
```

This header is already included in the app (`04-api.js`). No configuration needed for local file access.

For hosted deployments (GitHub Pages, Netlify, etc.), standard CORS applies — the Anthropic API allows browser requests from any origin when this header is present.

---

## API Key Security

| Practice | Details |
|----------|---------|
| **Never stored** | API keys are held in memory only — not in localStorage, cookies, or the DOM |
| **Only sent to provider** | Keys are sent directly to `api.anthropic.com` / `api.openai.com` / etc. — never to any third party |
| **No hardcoding** | Never embed an API key in `public/index.html` — always use the UI input |
| **Team use** | For shared team deployments, build a thin backend proxy that holds the key server-side and forwards requests |
| **Usage limits** | Set spend limits at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys) |

---

## Session & URL State

The app uses **browser localStorage** for two purposes:

| Data | Key | Expiry | Size |
|------|-----|--------|------|
| API response cache | `dh_cache_*` | 4 hours | ~1–3 MB per run |
| Session snapshot (R + HTML) | `biz_session_v1` | 24 hours | ~2–5 MB per run |
| User profile | `dh_profile` | Permanent | < 1 KB |

Shareable URLs use URL query parameters (`?zip=&industry=&radius=&capacity=&budget=`) — no server-side routing required. All params are read on DOMContentLoaded and applied to inputs.

---

## Browser Compatibility

| Browser | Version | Notes |
|---------|---------|-------|
| **Chrome** | 90+ | ✅ Fully supported — recommended |
| **Firefox** | 88+ | ✅ Fully supported |
| **Safari** | 14+ | ✅ Supported |
| **Edge** | 90+ | ✅ Fully supported |
| **IE 11** | — | ❌ Not supported |

Required browser features: `fetch`, ES2020, CSS custom properties (`var()`), `localStorage`, `URLSearchParams`, `navigator.clipboard`, `canvas.toDataURL`, `history.replaceState`.

---

## Content Security Policy (CSP)

If deploying behind a CSP, the app makes outbound `fetch` calls to:

```
https://api.anthropic.com
https://api.openai.com
https://generativelanguage.googleapis.com
https://fonts.googleapis.com
https://fonts.gstatic.com
https://cdnjs.cloudflare.com     (Chart.js)
```

Minimum CSP for Anthropic-only usage:
```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src https://api.anthropic.com;
  img-src 'self' data: blob:
```

> `data:` and `blob:` are needed for chart image capture in the Full PDF export (`canvas.toDataURL()` → `<img src="data:...">`).
