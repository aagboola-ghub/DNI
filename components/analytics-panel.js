import { evaluateNumber } from '../core/dni-engine.js';

class AnalyticsPanel extends HTMLElement{
  connectedCallback(){
    this.classList.add('card');
    this.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="card-title mb-0">Live DNI Debug</h5>
          <span class="badge rounded-pill bg-secondary" id="ruleId">—</span>
        </div>
        <div class="mb-2">
          <div class="small text-muted">Resolved Phone</div>
          <div class="h5"><span class="dni-highlight" id="resolvedPhone">—</span></div>
        </div>
        <pre class="bg-light p-2 small border rounded" id="ctx" style="max-height:240px; overflow:auto"></pre>
        <div class="mt-2 small text-muted">Recent Calls</div>
        <ul class="list-group list-group-flush small" id="calls"></ul>
      </div>`;
    this.render = this.render.bind(this);
    window.addEventListener('context-updated', this.render);
    window.addEventListener('call-recorded', this.render);
    this.render();
  }
  disconnectedCallback(){
    window.removeEventListener('context-updated', this.render);
    window.removeEventListener('call-recorded', this.render);
  }
  async render(){
    const st = window.appState;
    if(!st?.profile || !st?.context) return;
    const res = evaluateNumber(st.profile, st.context);
    this.querySelector('#ruleId').textContent = res.ruleId;
    this.querySelector('#resolvedPhone').textContent = res.phone || '—';
    this.querySelector('#ctx').textContent = JSON.stringify(st.context, null, 2);
    const ul = this.querySelector('#calls');
    ul.innerHTML = '';
    const calls = await st.adapter?.getRecentCalls?.() || [];
    calls.slice().reverse().forEach(c=>{
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.innerHTML = `<strong>${c.id}</strong> · ${c.sentiment} · ${Math.round(c.durationSec)}s<br><span class="text-muted">${new Date(c.ts).toLocaleTimeString()}</span>`;
      ul.appendChild(li);
    });
  }
}
customElements.define('analytics-panel', AnalyticsPanel);
