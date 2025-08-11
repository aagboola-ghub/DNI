import { BRAND, SETTINGS } from "./config/index.js";
import { patch, subscribe } from "./store.js";
import { applyBrandTokens } from "./ui/Navbar.js";
import Hero from "./ui/Navbar.js";
import JourneyControls from "./ui/JourneyControls.js";
import TrackingPanel from "./ui/TrackingPanel.js";
import CallSim from "./ui/CallSim.js";
import CallAnalytics from "./ui/CallAnalytics.js";
import { renderStage } from "./utils/tracking.js";
import { assignNumbers } from "./core/dni-engine.js";
import { replaceDOM } from "./core/replacer.js";

// Apply brand tokens
applyBrandTokens();

// Mount hero
Hero(document.getElementById("hero"));

// Initialize tracking mode
patch({ trackingType: SETTINGS.defaultTrackingType });

// Mount UI
new JourneyControls(document.getElementById("journey-controls")).mount();
TrackingPanel(document.getElementById("tracking-panel"));
CallSim(document.getElementById("call-sim"));
CallAnalytics(document.getElementById("call-analytics"));

// Initial stage render
renderStage();

// Keep DOM numbers synced on state change
subscribe(()=>{ replaceDOM(); });

// Update brand header
document.getElementById("brand-logo").src  = `assets/img/${BRAND.assets.logo}`;
document.getElementById("brand-name").textContent = BRAND.name;

// Ensure numbers exist at load (brand defaults)
assignNumbers(); replaceDOM();
