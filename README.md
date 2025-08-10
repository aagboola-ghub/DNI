# Marchex DNI Demo — Modular WF Template

This package keeps the **exact Wells Fargo demo UI/flow** and makes it **config-driven** so Sales Engineers can quickly repurpose it for new prospects.

## Quick Start
1. Open `launcher.html` and click a config, or open `index.html?config=wells-fargo`.
2. Use the left-side controls (Source, Campaign, Tracking) to see phone numbers update across the page.
3. To switch prospects, change the `config` query param (e.g., `index.html?config=autodealer`).

> For **offline use**, place Bootstrap files into `/vendor/`:
> - `/vendor/bootstrap.min.css`
> - `/vendor/bootstrap.bundle.min.js`
> The HTML already prefers local files and falls back to CDN if missing.

## How to Create a New Prospect (≤ 30 minutes)
1. Duplicate a config in `/configs`, e.g., `wells-fargo.json` → `my-prospect.json`.
2. Edit only these keys:
   - `branding.logo`, `branding.favicon`
   - `palette.primary | secondary | accent | text`
   - `copy.heroHeadline`, `copy.ctaPrimary` (add more copy keys if desired)
   - `phone.pool` and `phone.formatMask` (optional)
   - `dniRules` (map `{ source, campaignType } → number`)
   - `presets.default` (`source`, `campaignType`, `trackingMode`)
3. Launch with `index.html?config=my-prospect`.

## Config Reference
- **branding**: file paths for logo and favicon
- **palette**: theme colors injected as CSS variables
- **copy**: top-level copy hooks you can extend
- **phone**: number pool & format (display only)
- **dniRules**: ordered array; first matching rule wins.
  - Supports equality (`"source":"google"`) and `$in` (`"source":{"$in":["facebook","microsoft"]}}`)
- **presets**: list of sources/modes and defaults used at load.

## What’s Removed
- The **Session ID** row and the **Marchex AI Insights** block have been permanently removed from the markup (not just hidden).

## Files & Modules
- `index.html` — your original markup (WF UI) with Bootstrap 5
- `/styles/wf.css` — your extracted styles (unchanged)
- `/styles/b4-compat.css` — small Bootstrap 4→5 shim
- `/styles/theme.css` — palette variables driven by config
- `/scripts/app.js` — tiny bootstrap; no jQuery
- `/scripts/wf-bindings.js` — binds config & state to existing DOM
- `/scripts/dni.js` — pure rules + DOM updates
- `/scripts/telemetry.js` — simple event bus (Brave-friendly)
- `/scripts/config/loader.js` — loads configs from `/configs`
- `/configs/*.json` — ready-to-use templates
- `/tests/self-test.html` — runs rule fixtures

## Troubleshooting
- **Blank page in Brave**: This build uses `telemetry.js` (no “tracking” in filename), so it should be fine. If needed, disable Shields for the site.
- **Numbers not changing**: Check `dniRules` order; ensure `source` and `campaignType` match your buttons.
- **Offline CSS**: Add Bootstrap files to `/vendor/` so the layout matches when offline.

## Extending Copy
`wf-bindings.js` maps a minimal set of copy fields. If you add more keys to `copy`, wire them by selecting an existing DOM node and setting `textContent` in `bind()`.
