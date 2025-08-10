class SessionView extends HTMLElement{
  connectedCallback(){
    this.classList.add('card');
    this.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Session Data</h5>
        <pre class="bg-light p-2 small border rounded" id="data" style="max-height:240px; overflow:auto"></pre>
      </div>`;
    this.render = this.render.bind(this);
    window.addEventListener('context-updated', this.render);
    this.render();
  }
  disconnectedCallback(){
    window.removeEventListener('context-updated', this.render);
  }
  render(){
    const st = window.appState;
    this.querySelector('#data').textContent = JSON.stringify(st?.context || {}, null, 2);
  }
}
customElements.define('session-view', SessionView);
