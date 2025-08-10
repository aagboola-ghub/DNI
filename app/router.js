export class Router{
  constructor(slotSelector, state){
    this.slot = document.querySelector(slotSelector);
    this.state = state;
    this.routes = new Set(['home','products','product-detail','contact']);
    this.current = 'home';
    window.addEventListener('hashchange', ()=>this.navigate());
  }
  async navigate(){
    const page = location.hash.replace('#/','') || 'home';
    if(!this.routes.has(page)){ return this.render404(); }
    this.current = page;
    this.state.context.pageId = page;
    const res = await fetch(`./pages/${page}.html`);
    const html = await res.text();
    this.slot.innerHTML = html;
    window.dispatchEvent(new CustomEvent('context-updated', { detail: this.state.context }));
  }
  render404(){
    this.slot.innerHTML = `<div class="alert alert-warning">Page not found</div>`;
  }
  start(){
    if(!location.hash) location.hash = '#/home';
    this.navigate();
  }
}
