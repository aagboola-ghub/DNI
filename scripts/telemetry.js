
const bus = new EventTarget();
export function on(evt, handler){ bus.addEventListener(evt, handler); }
export function off(evt, handler){ bus.removeEventListener(evt, handler); }
export function emit(name, detail={}){ bus.dispatchEvent(new CustomEvent(name, { detail: Object.assign({ ts: Date.now() }, detail) })); }
