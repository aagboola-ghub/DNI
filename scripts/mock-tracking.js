
import { state, subscribe } from './store.js';
const bus = new EventTarget();
export function on(evt, handler){ bus.addEventListener(evt, handler); }
export function track(name, detail={}){
  bus.dispatchEvent(new CustomEvent(name, { detail: Object.assign({ ts:Date.now(), sessionId: state.sessionId }, detail) }));
}
subscribe(s => track('state:update', s));
export function simulateCall(outcome){ track('call:started'); setTimeout(()=> track('call:ended', { outcome }), 600); }
