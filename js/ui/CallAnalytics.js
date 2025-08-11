import { subscribe, getState } from "../store.js";

export default function CallAnalytics(root){
  const render = (s) => {
    const lastCall = s.events.find(e => e.type === "call");
    if (!lastCall){
      root.innerHTML = `<div class="card card-body"><h5 class="mb-2">Call Analytics</h5><p class="muted">Simulate a call to see analytics.</p></div>`;
      return;
    }
    const c = lastCall;
    root.innerHTML = `
      <div class="card card-body">
        <h5 class="mb-2">Call Analytics</h5>
        <div class="kv">
          <div class="key">UTM campaign</div><div>${c.utm.campaign || '<span class="placeholder">—</span>'}</div>
          <div class="key">UTM source</div><div>${c.utm.source || '<span class="placeholder">—</span>'}</div>
          <div class="key">UTM medium</div><div>${c.utm.medium || '<span class="placeholder">—</span>'}</div>
          <div class="key">UTM term/keyword</div><div>${c.utm.term || '<span class="placeholder">—</span>'}</div>
          <div class="key">UTM content</div><div>${c.utm.content || '<span class="placeholder">—</span>'}</div>
          <div class="key">Landing page URL</div><div>${c.landingUrl}</div>
          <div class="key">Start date and time</div><div>${c.startedAt}</div>
          <div class="key">Duration (sec)</div><div>${c.duration}</div>
          <div class="key">Tracking number</div><div>${c.trackingNumber}</div>
          <div class="key">Caller’s phone number</div><div>${c.caller}</div>
        </div>
      </div>
    `;
  };
  render(getState());
  subscribe(render);
}
