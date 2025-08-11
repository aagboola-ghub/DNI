// --- Edit just this line to rebrand the demo ---
export const ACTIVE_BRAND = "wellsFargo"; // "acmeBank"

export const SETTINGS = {
  defaultTrackingType: "session",
  showAdvancedPanels: true,
  // fbclid appears on Facebook organic by default; can be disabled per prospect.
  fbclidOnOrganic: true
};

import wellsFargo from "./brands/wellsFargo.js";
import acmeBank   from "./brands/acmeBank.js";

export const BRANDS = { wellsFargo, acmeBank };
export const BRAND  = BRANDS[ACTIVE_BRAND];
