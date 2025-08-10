class CallSim extends HTMLElement{
  connectedCallback(){
    this.innerHTML = `
      <div class="card">
        <div class="card-body">
          <div class="d-flex gap-2">
            <button class="btn btn-primary" id="callBtn">Simulate Call</button>
            
          </div>
          <div class="mt-3 small text-muted">Simulated call will push a record to the adapter and update "Recent Calls".</div>
        </div>
      </div>`;
    this.querySelector('#callBtn').addEventListener('click', ()=> this.simulate());
          }
  async simulate(){
    const st = window.appState;
    const rec = await st.adapter?.trackCall?.(st.context);
    if(rec){
      const evt = new CustomEvent('call-recorded', { detail: rec });
      window.dispatchEvent(evt);
    }
  }
        location.search = params.toString();
  }
}
customElements.define('call-sim', CallSim);
