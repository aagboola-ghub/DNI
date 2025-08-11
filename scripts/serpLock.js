
export function initSerpLock(state,cfg){
  const P={dash:'—',landing:'Not yet navigated',tracking:'Not yet assigned'};
  const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent=v;};
  function blankAll(){ ['traffic-source','utm-source','utm-medium','utm-campaign','utm-term','click-id','original-number','campaign-type','tracking-mode'].forEach(id=>set(id,P.dash)); set('landing-page',P.landing); set('tracking-number',P.tracking); const a=document.getElementById('tracking-number-link'); if(a) a.removeAttribute('href'); }
  const render=()=>{ if(state.stage==='serp') blankAll(); };
  document.addEventListener('DOMContentLoaded', render);
  document.body.addEventListener('click', e=>{
    if(e.target.closest('#back-to-results,[data-nav-back],.back-to-results')) setTimeout(render,0);
    if(/reset demo/i.test((e.target.textContent||''))) setTimeout(render,0);
  }, true);
}
