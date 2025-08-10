class BrandHeader extends HTMLElement{
  connectedCallback(){
    this.render();
  }
  async render(){
    this.innerHTML = `
      <nav class="navbar navbar-expand bg-light">
        <div class="container-fluid">
          <div class="d-flex align-items-center gap-2">
            <img id="logo" alt="logo" style="height:28px"/>
            <strong>Marchex DNI Demo</strong>
            <span class="badge badge-brand ms-2">No-build</span>
          </div>
          <div class="ms-auto d-flex align-items-center gap-2">
            <label class="small text-muted me-1">Profile</label>
            <select id="profileSel" class="form-select form-select-sm w-auto"></select>
            <a class="btn btn-sm btn-outline-secondary" href="#/home">Home</a>
            <a class="btn btn-sm btn-outline-secondary" href="#/products">Products</a>
            <a class="btn btn-sm btn-outline-secondary" href="#/product-detail">Detail</a>
            <a class="btn btn-sm btn-outline-secondary" href="#/contact">Contact</a>
          </div>
        </div>
      </nav>`;
    await this.populateProfiles();
    this.updateLogo();
  }
  async populateProfiles(){
    const sel = this.querySelector('#profileSel');
    const entries = ['wells-fargo','acme-bank']; // simple inline index; can be fetched if preferred
    const profileId = (new URLSearchParams(location.search).get('profile')) || 'wells-fargo';
    sel.innerHTML = entries.map(id=> `<option value="${id}" ${id===profileId?'selected':''}>${id}</option>`).join('');
    sel.addEventListener('change', ()=>{
      const params = new URLSearchParams(location.search);
      params.set('profile', sel.value);
      location.search = params.toString();
    });
  }
  updateLogo(){
    const logo = window.appState?.profile?.brand?.logo;
    if(logo) this.querySelector('#logo').src = logo;
  }
}
customElements.define('brand-header', BrandHeader);
