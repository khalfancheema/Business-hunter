# Deployment Guide

## Option 1: Local File (Simplest)

```bash
open public/index.html          # Mac
start public/index.html         # Windows
xdg-open public/index.html      # Linux
```

No server, no install. Just double-click.

---

## Option 2: Local Dev Server

```bash
# Using Python (built-in)
python3 -m http.server 8080 --directory public
# → Open http://localhost:8080

# Using Node serve
npx serve public -l 8080
# → Open http://localhost:8080

# Using npm script
npm run serve
```

---

## Option 3: GitHub Pages

1. Push to GitHub
2. Go to repo → Settings → Pages
3. Set source: `main` branch, `/public` folder
4. Access at `https://yourusername.github.io/daycare-agent-system`

No build step needed — `public/index.html` is self-contained.

---

## Option 4: Netlify / Vercel (1-click)

**Netlify:**
```
Build command: (leave empty)
Publish directory: public
```

**Vercel:**
```
Framework: Other
Output directory: public
```

---

## Option 5: AWS S3 Static Website

```bash
aws s3 sync public/ s3://your-bucket-name --acl public-read
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

---

## CORS Note

When running from a local file (`file://` protocol), the Anthropic API requires:
```
anthropic-dangerous-direct-browser-access: true
```

This header is already included in the app. No configuration needed.

---

## API Key Security

- The API key is **never stored** — it lives in memory only for the session
- It is **only sent to** `api.anthropic.com`
- Never deploy with a hardcoded API key — always use the UI input
- For team use, consider wrapping the API with a backend proxy that holds the key server-side

---

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Fully supported |
| Firefox 88+ | ✅ Fully supported |
| Safari 14+ | ✅ Supported |
| Edge 90+ | ✅ Fully supported |
| IE 11 | ❌ Not supported |
