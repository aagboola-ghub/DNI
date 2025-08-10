
import { state, set } from '../store.js';
import { applyDni } from '../dni.js';
import { track, simulateCall } from '../mock-tracking.js';

export function mountCallPanel(root, cfg){
  const sources = cfg.presets.trafficSources, modes = cfg.presets.trackingModes;
  root.innerHTML = `
  <div class="card mt-3">
    <div class="card-body">
      <h2 class="h5 mb-3">Journey Controls</h2>
      <div class="row g-3">
        <div class="col-md-4"><label class="form-label">Source</label>
          <select id="selSource" class="form-select">${sources.map(s=>`<option value="${s}">${s}</option>`).join('')}</select></div>
        <div class="col-md-4"><label class="form-label">Campaign</label>
          <select id="selCampaign" class="form-select"><option value="paid">paid</option><option value="organic">organic</option></select></div>
        <div class="col-md-4"><label class="form-label">Tracking</label>
          <select id="selMode" class="form-select">${modes.map(m=>`<option value="${m}">${m}</option>`).join('')}</select></div>
      </div>
      <div class="mt-3 d-flex gap-2">
        <button id="btnApply" class="btn btn-primary">Apply</button>
        <button id="btnCall" class="btn btn-outline-secondary">Call Simulation</button>
      </div>
      <div class="mt-2 small text-muted">Active Number: <span class="fw-semibold" id="activeNum">(pending)</span></div>
    </div>
  </div>`;
  const selSource = root.querySelector('#selSource');
  const selCampaign = root.querySelector('#selCampaign');
  const selMode = root.querySelector('#selMode');
  root.querySelector('#btnApply').addEventListener('click', () => {
    set('source', selSource.value); set('campaignType', selCampaign.value); set('trackingMode', selMode.value);
    track('context:applied', { source: selSource.value, campaignType: selCampaign.value, trackingMode: selMode.value });
    const num = applyDni(cfg.dniRules); root.querySelector('#activeNum').textContent = num || '(none)';
  });
  root.querySelector('#btnCall').addEventListener('click', () => simulateCall({ sentiment: 'positive' }));
}
