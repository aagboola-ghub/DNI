import { getState, patch, merge, resetSession } from "../store.js";
import { el, mount } from "../utils/dom.js";
import { applyBrandTokens } from "./Navbar.js";
import { visitFromSerp, applyChannelChange } from "../utils/tracking.js";

export default class JourneyControls {
  constructor(root){ this.root = root; }
  mount(){
    const s = getState();
    const node = el(`
      <div class="card card-body">
        <div class="grid-2">
          <div>
            <label>Stage</label>
            <div class="flex">
              <button id="to-serp" class="btn btn-outline">SERP / Feed</button>
              <button id="visit" class="btn btn-brand">Visit Site</button>
            </div>
          </div>
          <div>
            <label>Tracking Semantics</label>
            <div class="flex">
              <button id="track-session"  class="btn ${s.trackingType==='session'?'btn-brand':'btn-outline'}">Session</button>
              <button id="track-channel"  class="btn ${s.trackingType==='channel'?'btn-brand':'btn-outline'}">Channel</button>
            </div>
          </div>

          <div>
            <label>Source</label>
            <select id="jc-source" class="form-control">
              <option value="google">Google</option>
              <option value="bing">Bing</option>
              <option value="facebook">Facebook</option>
              <option value="direct">Direct</option>
            </select>
          </div>
          <div>
            <label>Flavor</label>
            <select id="jc-flavor" class="form-control">
              <option value="paid">Paid</option>
              <option value="organic">Organic</option>
            </select>
          </div>

          <div>
            <label>UTM Campaign</label>
            <input id="jc-campaign" class="form-control" placeholder="spring_business_2025">
          </div>
          <div>
            <label>UTM Term</label>
            <input id="jc-term" class="form-control" placeholder="small business checking">
          </div>
          <div>
            <label>UTM Content</label>
            <input id="jc-content" class="form-control" placeholder="ad-variant-a">
          </div>
        </div>

        <div class="flex mt-3">
          <button id="apply-channel" class="btn btn-outline">Apply Channel Change</button>
        </div>
      </div>
    `);
    mount(node, this.root);

    const selSource = node.querySelector("#jc-source");
    const selFlavor = node.querySelector("#jc-flavor");

    selSource.value = s.selection.source;
    selFlavor.value = s.selection.flavor;

    node.querySelector("#to-serp").addEventListener("click", () => resetSession());
    node.querySelector("#visit").addEventListener("click", () => {
      // store pending utm inputs for computation
      merge('utm', {
        campaign: node.querySelector("#jc-campaign").value.trim(),
        term:     node.querySelector("#jc-term").value.trim(),
        content:  node.querySelector("#jc-content").value.trim()
      });
      merge('selection', {
        source: selSource.value, flavor: selFlavor.value
      });
      visitFromSerp(); // computes UTMs, clickId, landing, assigns numbers
    });

    node.querySelector("#track-session").addEventListener("click", () => patch({ trackingType:"session" }));
    node.querySelector("#track-channel").addEventListener("click", () => patch({ trackingType:"channel" }));

    node.querySelector("#apply-channel").addEventListener("click", () => {
      merge('utm', {
        campaign: node.querySelector("#jc-campaign").value.trim(),
        term:     node.querySelector("#jc-term").value.trim(),
        content:  node.querySelector("#jc-content").value.trim()
      });
      merge('selection', { source: selSource.value, flavor: selFlavor.value });
      applyChannelChange(); // allowed to mutate tracking only in channel mode
    });
  }
}
