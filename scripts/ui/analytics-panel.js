
import { state, subscribe } from '../store.js';
import { resolveNumber } from '../dni.js';
import { on } from '../mock-tracking.js';
export function mountAnalyticsPanel(root, cfg){
  root.innerHTML = `
  <div class="card mt-3">
    <div class="card-body">
      <h2 class="h5 mb-3">Real-Time Tracking</h2>
      <div class="row">
        <div class="col-6"><div class="small text-muted">Session</div><pre id="sessionState" class="mb-0"></pre></div>
        <div class="col-6"><div class="small text-muted">Rule</div><pre id="ruleView" class="mb-0"></pre></div>
      </div>
      <hr class="my-3"/><div class="small text-muted">Event Log</div><ol id="log" class="small mb-0"></ol>
    </div>
  </div>`;
  const sessionEl = root.querySelector('#sessionState');
  const ruleEl = root.querySelector('#ruleView');
  const logEl = root.querySelector('#log'); const logs = [];
  function refresh(){ sessionEl.textContent = JSON.stringify(state, null, 2);
    const num = resolveNumber(cfg.dniRules, state);
    ruleEl.textContent = JSON.stringify({ number: num, source: state.source, campaignType: state.campaignType }, null, 2); }
  subscribe(refresh); refresh();
  on('state:update', e => pushLog('state:update', e.detail));
  on('page:view', e => pushLog('page:view', e.detail));
  on('context:applied', e => pushLog('context:applied', e.detail));
  on('call:started', e => pushLog('call:started', e.detail));
  on('call:ended', e => pushLog('call:ended', e.detail));
  function pushLog(name, detail){ logs.unshift({ name, detail, ts: new Date().toLocaleTimeString() });
    if (logs.length > 8) logs.pop(); logEl.innerHTML = logs.map(l=>`<li>[${l.ts}] <strong>${l.name}</strong> — <code>${escapeHtml(JSON.stringify(l.detail))}</code></li>`).join(''); }
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
