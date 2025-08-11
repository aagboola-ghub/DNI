import { subscribe, getState } from "../store.js";

export default function mountTelemetry(target){
  const render = (s) => {
    target.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="mb-2">Tracking Panel</h5>
          <div class="kv">
            <div class="key">Stage</div><div>${s.stage}</div>
            <div class="key">Tracking</div><div>${s.trackingType}</div>
            <div class="key">UTM Source</div><div>${s.utm.source || '<span class="placeholder">—</span>'}</div>
            <div class="key">UTM Medium</div><div>${s.utm.medium || '<span class="placeholder">—</span>'}</div>
            <div class="key">UTM Campaign</div><div>${s.utm.campaign || '<span class="placeholder">—</span>'}</div>
            <div class="key">UTM Term</div><div>${s.utm.term || '<span class="placeholder">—</span>'}</div>
            <div class="key">UTM Content</div><div>${s.utm.content || '<span class="placeholder">—</span>'}</div>
            <div class="key">Click ID</div><div>${s.clickId || '<span class="placeholder">—</span>'}</div>
            <div class="key">Landing URL</div>
              <div>${s.landingUrl || '<span class="placeholder">Not yet navigated</span>'}</div>
            <div class="key">Tracking Number</div>
              <div>${(s.assigned.primary)||'<span class="placeholder">Not yet assigned</span>'}</div>
          </div>
        </div>
      </div>
    `;
  };
  render(getState());
  subscribe(render);
}
