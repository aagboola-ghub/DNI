# Marchex DNI Demo — Sales Engineer Guide (No-Code)

This demo shows how Marchex **Dynamic Number Insertion (DNI)** ties a phone call back to the original web traffic source. It’s packaged so you can **run it locally**, **switch brands in seconds**, and **create a new prospect demo in under 30 minutes** without writing code.

---

## 1) What’s in the box (plain English)
- **index.html** — the Wells Fargo demo page (exact UI/flow you’re used to).
- **launcher.html** — a simple start page with buttons for each demo template.
- **/configs** — small text files that define brand, colors, and which phone number to show for each traffic source.
- **/scripts** — the “wiring” that reads a config and updates the page. You don’t need to change these.
- **/vendor** — optional folder for Bootstrap files if you want **true offline** (no internet).

You’ll mostly work in **/configs** and **launcher.html**.

---

## 2) Quick Start (2 minutes)
1. Open **launcher.html** and click a template (e.g., *Wells Fargo — Business Banking*).
2. On the left panel, click **Source** (Google/Facebook/Microsoft) and **Campaign** (Paid/Organic).
3. Watch the **phone number** update on the right-side page in real time. That’s DNI at work.
4. To switch brands, go back to **launcher.html** and pick another template.

> Tip: Hard refresh if something looks cached (Ctrl/Cmd + Shift + R).

---

## 3) How to present (suggested flow: 3–5 minutes)
1. **Set the scene** — “Let’s pretend this visitor came from Google Paid Search.”
2. **Click Source: Google + Campaign: Paid**. Point to the phone number on the page.
3. **Explain DNI** — “When they call, we’ll tie the call back to Google Paid Search.”
4. **Flip to Organic** — “Now change the campaign to Organic; see the number change? We’d attribute this call to Organic.”
5. **Change Source** — Try Facebook or Microsoft; the number changes to the correct tracking line.

Keep it simple. The left panel is your control room; the right side is what a visitor sees.

---

## 4) Testing modularity (show it’s rebrandable)
**Option A — Use built-in templates**
- Open **launcher.html**. Try: Wells Fargo, Closet Factory, BankCo, AutoDealer, InsuranceCo.
- Notice colors and copy change, and **DNI rules** (which number shows) are different per brand.

**Option B — Create your own brand (≤ 30 minutes)**
1. Duplicate a file in `/configs` (e.g., copy `bankco.json` → `my-prospect.json`).
2. Edit these fields in your copy:
   - **branding.logo** — path to the logo image (PNG/SVG).
   - **palette** — primary/secondary/accent/text colors (hex).
   - **copy.heroHeadline** and **copy.ctaPrimary** — simple text blocks.
   - **phone.pool** — the numbers you want to display.
   - **dniRules** — the mapping from **source + campaign** to a **number**.
   - **presets.default** — the starting selection (e.g., Google + Paid).
3. Launch your demo:
   - Go to `index.html?config=my-prospect` **or** add a button in **launcher.html**.

That’s it—no code changes.

---

## 5) Where to change what (cheat sheet)
- **Logo**: put the file in `/assets/logos/` and update `branding.logo` in your config.
- **Colors**: change the hex values under `palette` in your config.
- **Text**: update the `copy` section (e.g., hero headline, CTA text).
- **Phone numbers**: edit `phone.pool` and then set `dniRules` (see below).
- **DNI rules**: choose the number shown for each visitor context:
  ```json
  {
    "dniRules": [
      { "when": { "source": "google", "campaignType": "paid" },    "number": "(800) 111-2222" },
      { "when": { "source": "google", "campaignType": "organic" }, "number": "(800) 333-4444" },
      { "when": { "source": "facebook" },                          "number": "(800) 555-6666" },
      { "when": { "source": "microsoft" },                         "number": "(800) 777-8888" }
    ]
  }
  ```
  The first matching rule wins.

---

## 6) Pre‑meeting checklist (2 minutes)
- Open **launcher.html** and pick the right brand.
- Click through **Google Paid → Organic → Facebook → Microsoft** and confirm the number changes as expected.
- If you created a new config, verify **logo**, **colors**, and **copy** look right.

Optional sanity check: open **tests/validator.html** (if present) — it auto-checks layout and basic DNI behavior.

---

## 7) Troubleshooting (fast fixes)
- **Blank page in Brave**: This demo avoids “tracking” in filenames. If you still see blocking, lower Shields for your local file/host.
- **Number doesn’t change**: Confirm your `source` and `campaignType` buttons exist on the left, and your `dniRules` include a matching rule.
- **Colors didn’t update**: Hex codes must include `#` (e.g., `#D71E28`). Save the config and hard refresh.
- **Logo not showing**: Make sure the path in `branding.logo` points to a real file in `/assets/logos/`.

---

## 8) Offline mode (optional)
If you need to run **without internet**:
1. Put `bootstrap.min.css` and `bootstrap.bundle.min.js` in `/vendor/`.
2. That’s it—`index.html` automatically uses local files first.

---

## 9) FAQ
**Q: Do I need to install anything?**  
A: No. Open the HTML files in a browser or host them from any static server (e.g., GitHub Pages).

**Q: Can we add more sources (e.g., Yelp)?**  
A: Yes—add the label to `presets.trafficSources` and create a matching entry in `dniRules` with the number you want.

**Q: Where’s the real Marchex tag?**  
A: This demo runs offline with mocked behavior. In production, the same concepts apply—the phone number replacement is driven by visitor context and rules.

---

## 10) Folder map (for reference)
- `/configs` — brand files you edit (JSON)
- `/assets` — logos/icons/images
- `/scripts` — demo wiring (don’t edit)
- `/vendor` — optional Bootstrap files for offline use
- `/tests` — optional validator/fixtures

If you want a new “starter” config created for you, send me the brand colors, logo, and desired phone number rules, and I’ll hand back a ready-to-click template.


---
**Note:** For Microsoft/Bing traffic, this demo uses `utm_source=bing` (industry-standard) while the UI may label the channel as “Microsoft” for clarity in Sales demos.
