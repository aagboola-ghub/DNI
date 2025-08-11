import { getState } from "../store.js";
import { el, mount } from "../utils/dom.js";

export default function LandingView(target){
  const s = getState();
  const node = el(`
    <div class="card card-body">
      <h5 class="mb-2">Landing / Internal Navigation (Post-click)</h5>
      <div class="kv">
        <div class="key">UTM Source</div><div>${s.utm.source}</div>
        <div class="key">UTM Medium</div><div>${s.utm.medium}</div>
        <div class="key">UTM Campaign</div><div>${s.utm.campaign || '<span class="placeholder">—</span>'}</div>
        <div class="key">UTM Term</div><div>${s.utm.term || '<span class="placeholder">—</span>'}</div>
        <div class="key">UTM Content</div><div>${s.utm.content || '<span class="placeholder">—</span>'}</div>
        <div class="key">Click ID</div><div>${s.clickId || '<span class="placeholder">—</span>'}</div>
        <div class="key">Landing Page URL</div><div>${s.landingUrl}</div>
        <div class="key">Tracking Number</div><div>${s.assigned.primary}</div>
      </div>
    </div>
  `);
  mount(node, target);
}
