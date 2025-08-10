class JourneySim extends HTMLElement{
  connectedCallback(){
    this.innerHTML = `
    <div class="card">
      <div class="card-body">
        <div class="row g-3 align-items-end">
          <div class="col-sm-4">
            <label class="form-label">Source</label>
            <select class="form-select" id="src">
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="microsoft">Microsoft</option>
            </select>
          </div>
          <div class="col-sm-4">
            <label class="form-label">Campaign</label>
            <select class="form-select" id="camp">
              <option value="paid">Paid</option>
              <option value="organic">Organic</option>
            </select>
          </div>
          <div class="col-sm-4">
            <label class="form-label">Tracking Mode</label>
            <select class="form-select" id="mode">
              <option value="session">Session</option>
              <option value="channel">Channel</option>
            </select>
          </div>
        </div>
      </div>
    </div>`;
    this.onChange = this.onChange.bind(this);
    this.querySelectorAll('select').forEach(s => s.addEventListener('change', this.onChange));
  }
  onChange(){
    const detail = {
      source: this.querySelector('#src').value,
      campaignType: this.querySelector('#camp').value,
      trackingMode: this.querySelector('#mode').value
    };
    this.dispatchEvent(new CustomEvent('context-changed', { detail, bubbles: true }));
  }
}
customElements.define('journey-sim', JourneySim);
