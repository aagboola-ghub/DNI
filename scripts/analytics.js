
export function initAnalytics(state,cfg){
  const $=s=>document.querySelector(s);
  function fmtPhone(s){ const d=(s||'').replace(/[^\d]/g,''); if(d.length===11&&d[0]==='1') return `+1 ${d.slice(1,4)}-${d.slice(4,7)}-${d.slice(7)}`; if(d.length===10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`; return s||''; }
  document.addEventListener('click', e=>{
    const btn=e.target.closest('#simulate-call,[data-simulate-call]'); if(!btn) return;
    const payload={
      attribution_details:{
        utm_campaign: $('#utm-campaign')?.textContent||'—',
        utm_source:   $('#utm-source')?.textContent||'—',
        utm_medium:   $('#utm-medium')?.textContent||'—',
        utm_term:     $('#utm-term')?.textContent||'',
        utm_content:  '',
        landing_page_url: $('#landing-page')?.textContent || (location.hostname+location.pathname)
      },
      start_time:new Date().toISOString(),
      call_duration:268,
      tracking_number: $('#tracking-number')?.textContent||'',
      caller_number:'+15559876543'
    };
    const items=[
      ['The UTM campaign',payload.attribution_details.utm_campaign],
      ['The UTM source',payload.attribution_details.utm_source],
      ['The UTM medium',payload.attribution_details.utm_medium],
      ['The UTM term/keyword',payload.attribution_details.utm_term],
      ['The UTM content',payload.attribution_details.utm_content],
      ['The landing page URL',payload.attribution_details.landing_page_url],
      ['Start date and time',new Date(payload.start_time).toLocaleString()],
      ['Duration of call in seconds',String(payload.call_duration)],
      ['Tracking number',fmtPhone(payload.tracking_number)],
      ["Caller's phone number",fmtPhone(payload.caller_number)]
    ].map(([k,v])=>`<div class="d-flex justify-content-between border-bottom py-1"><div class="me-3"><strong>${k}</strong></div><div class="text-break">${v||''}</div></div>`).join('');
    const left=document.getElementById('call-analytics-body'); if(left){ left.innerHTML=items; left.closest('#call-analytics-card').style.display=''; }
    const modalBody=document.querySelector('.modal.show .modal-body'); if(modalBody) modalBody.innerHTML=items;
  });
}
