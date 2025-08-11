
export class Templates{
  constructor(rootSel){ this.root=document.querySelector(rootSel); }
  async mount(serp,land,check,controls){
    const [a,b,c,d] = await Promise.all([serp,land,check,controls].map(p=>fetch(p).then(r=>r.text())));
    this.root.innerHTML = `
      <div class="header"><div class="brand"><span id="brand-name">DNI Demo</span></div></div>
      <div class="layout">
        <div class="left sticky" id="left-col">${d}</div>
        <div id="right-col">
          <div id="serp-pane">${a}</div>
          <div id="site-pane" class="site-pane">${b}${c}</div>
        </div>
      </div>`;
  }
  showSerp(){ document.getElementById('serp-pane').classList.remove('hidden'); const s=document.getElementById('site-pane'); s.classList.remove('active'); s.classList.add('hidden'); }
  showSite(){ document.getElementById('serp-pane').classList.add('hidden'); const s=document.getElementById('site-pane'); s.classList.remove('hidden'); s.classList.add('active'); }
}
