
const listeners = new Set();
export const state = { source:null, campaignType:null, trackingMode:'session', activeNumber:null, sessionId: String(Date.now()) };
export function subscribe(fn){ listeners.add(fn); return () => listeners.delete(fn); }
function emit(){ listeners.forEach(fn => fn(state)); }
export function set(k,v){ state[k]=v; emit(); }
export function setMany(d){ Object.assign(state,d); emit(); }
