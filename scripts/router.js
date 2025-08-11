
export class Router{
  constructor(state, tpl){ this.state=state; this.tpl=tpl; this._listeners=[]; this.bind(); }
  onChange(fn){ this._listeners.push(fn); }
  emit(){ this._listeners.forEach(fn=>fn()); }
  bind(){
    document.body.addEventListener('click', e=>{
      const link = e.target.closest('[data-nav="ad"], [data-nav="organic"], .result-link');
      if(!link) return;
      e.preventDefault();
      this.state.stage='site';
      this.state.landingUrl = (document.querySelector('.result .site')?.textContent || location.hostname+location.pathname);
      this.emit();
      this.tpl.showSite();
    }, true);
    document.body.addEventListener('click', e=>{
      if(!e.target.closest('#back-to-results, [data-nav-back], .back-to-results')) return;
      e.preventDefault();
      this.state.stage='serp'; this.emit(); this.tpl.showSerp();
    }, true);
    document.body.addEventListener('click', e=>{
      if(/reset demo/i.test((e.target.textContent||''))){ this.state.stage='serp'; this.emit(); this.tpl.showSerp(); }
    }, true);
  }
}
