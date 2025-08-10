
import { setText } from './utils/dom.js';
import { resolveNumber, applyToDom } from './dni.js';
import { emit } from './telemetry.js';

export function bind(config, state){
  // Branding (optional): you can swap logos/text here if the DOM has targets
  // Colors
  const r = document.documentElement.style;
  const p = config.palette || {};
  Object.entries(p).forEach(([k,v]) => r.setProperty(`--${k}`, v));
function updateNumber(config, state){
  const number = resolveNumber(config.dniRules || [], state);
  applyToDom(number);
  const ids = ['tracking-number','tracking-number-value','trackingNumber','tracking_number'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = number || 'Not yet assigned'; });
  const link = document.getElementById('tracking-number-link');
  if (link && number) link.setAttribute('href', `tel:${number.replace(/\D/g,'')}`);
}

  // Friendly Analytics renderer (labels for prospects)
  function setCallStatus(text){
    const sels = ['#call-status','#callModalStatus','.call-status','[data-call-status]'];
    sels.forEach(sel => document.querySelectorAll(sel).forEach(el=>{el.textContent=text;}));
    document.querySelectorAll('*').forEach(el => {
      const t=(el.textContent||'').trim();
      if (t==='A call would include all tracking data' || t==='No Call Made Yet') { el.style.display='none'; }
    });
  }
  on('call:start', ()=> setCallStatus('Call started (simulated)'));
  function renderFriendlyAnalytics(data){
    const modalBody = document.querySelector('.modal.show .modal-body') || document.querySelector('#callModal .modal-body') || document.querySelector('[data-call-modal]');
    if(!modalBody) return;
    const fmtPhone = (s)=>{ const d=(s||'').replace(/[^\d]/g,''); if(!d) return ''; if(s&&s.trim().startsWith('+')) return s; if(d.length===10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`; if(d.length===11&&d[0]==='1') return `+1 ${d.slice(1,4)}-${d.slice(4,7)}-${d.slice(7)}`; return s; };
    const items = [
      ['The UTM campaign', data.attribution_details.utm_campaign],
      ['The UTM source', data.attribution_details.utm_source],
      ['The UTM medium', data.attribution_details.utm_medium],
      ['The UTM term/keyword', data.attribution_details.utm_term],
      ['The UTM content', data.attribution_details.utm_content || ''],
      ['The landing page URL', data.attribution_details.landing_page_url],
      ['Start date and time', new Date(data.start_time).toLocaleString()],
      ['Duration of call in seconds', String(data.call_duration)],
      ['Tracking number', fmtPhone(data.tracking_number)],
      ["Caller's phone number", fmtPhone(data.caller_number)]
    ];
    const html = `<div class=\"small text-muted mb-2\">Call Analytics</div>` + items.map(([k,v])=>`<div class=\"d-flex justify-content-between border-bottom py-1\"><div class=\"me-3\"><strong>${k}</strong></div><div class=\"text-break\">${v||''}</div></div>`).join('');
    modalBody.innerHTML = html;
  }
  on('call:end', ()=>{
    const cfg = window.__cfg || {}; const state = window.__state || {};
    const sourceMap = { google:'google_ads', facebook:'facebook_ads', microsoft:'microsoft_ads' };
    const medium = (state.campaignType === 'paid' ? 'cpc' : 'organic') || 'cpc';
    const attr = (cfg.attribution || {});
    const trackingText = (document.getElementById('tracking-number')||{}).textContent || '';
    const payload = {
      attribution_details: {
        utm_campaign: attr.utm_campaign || 'demo_campaign',
        utm_source: sourceMap[state.source] || state.source || 'direct',
        utm_term: attr.utm_term || '',
        utm_medium: medium,
        utm_content: attr.utm_content || '',
        landing_page_url: attr.landing_page_url || (location.hostname + location.pathname),
        rule_description: attr.rule_description || 'Demo DNI Rule'
      },
      start_time: new Date().toISOString(),
      call_duration: 268,
      tracking_number: trackingText || '',
      caller_number: '+15559876543'
    };
    renderFriendlyAnalytics(payload);
    setCallStatus('Call completed (simulated)');
  });
