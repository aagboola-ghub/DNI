import { getState } from "../store.js";
import { el, mount } from "../utils/dom.js";

export default function SerpView(target){
  const s = getState();
  const node = el(`
    <div class="card card-body">
      <h5 class="mb-2">SERP / Feed (Pre-click)</h5>
      <p class="muted">All tracking fields are placeholders until the user clicks a result or ad.</p>
      <div class="kv">
        <div class="key">UTM Source</div><div class="placeholder">—</div>
        <div class="key">UTM Medium</div><div class="placeholder">—</div>
        <div class="key">UTM Campaign</div><div class="placeholder">—</div>
        <div class="key">UTM Term</div><div class="placeholder">—</div>
        <div class="key">UTM Content</div><div class="placeholder">—</div>
        <div class="key">Click ID</div><div class="placeholder">—</div>
        <div class="key">Landing Page URL</div><div class="placeholder">Not yet navigated</div>
        <div class="key">Tracking Number</div><div class="placeholder">Not yet assigned</div>
      </div>
    </div>
  `);
  mount(node, target);
}
