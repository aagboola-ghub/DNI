const listeners = new Set();
const state = {
  stage: "serp", // "serp" | "landing"
  trackingType: "session", // "session" | "channel"
  // Pre-click selections (used to compute landing context on "Visit Site")
  selection: { source: "google", flavor: "paid", /* flavor: paid|organic */ },
  // Resolved tracking context (post-click)
  utm: { source: "", medium: "", campaign: "", term: "", content: "" },
  clickId: "", // gclid | msclkid | fbclid | ""
  landingUrl: "",
  assigned: { primary: null, support: null },
  events: [] // includes calls, rule applications, etc.
};

export const getState = () => structuredClone(state);
export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }
function emit(){ const s = getState(); for(const fn of listeners) fn(s); }
export function patch(next){ Object.assign(state, next); emit(); }
export function merge(path, obj){
  // simple shallow merge helper for state. path is 'utm' or 'selection'
  Object.assign(state[path], obj); emit();
}
export function pushEvent(evt){ state.events.unshift({ ts: Date.now(), ...evt }); emit(); }

// Session/channel semantics helpers
export function resetSession(){
  state.stage = "serp";
  state.utm = { source: "", medium: "", campaign: "", term: "", content: "" };
  state.clickId = ""; state.landingUrl = ""; state.assigned = { primary:null, support:null };
  emit();
}
