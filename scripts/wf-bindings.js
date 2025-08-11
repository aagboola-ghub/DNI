let __siteActivated = false;

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
  if (!__siteActivated) { try { renderTrackingDetails(config, state, null); } catch(e){} return; }
  if (typeof __journeyStage !== 'undefined' && __journeyStage !== 'site') { try { renderTrackingDetails(config, state, null); } catch(e){} return; }
  const number = resolveNumber(config.dniRules || [], state);
  if (__siteActivated) { applyToDom(number); }
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


// --- Journey stage management (SERP vs SITE)
let __journeyStage = 'serp'; // default to SERP (pre-click)
function setJourneyStage(stage){
  __journeyStage = stage === 'site' ? 'site' : 'serp';
  if (__journeyStage === 'serp'){
    try { renderTrackingDetails(window.__cfg||{}, window.__state||{}, null); } catch(e){}
  }
}


function renderTrackingDetails(config, state, number){
  /*HARD-LOCK SERP*/
  if (!__siteActivated) {
    const ids = ['traffic-source','utm-source','utm-medium','utm-campaign','utm-term','click-id','landing-page','original-number','tracking-number','campaign-type','tracking-mode'];
    ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '—'; });
    const link = document.getElementById('tracking-number-link'); if (link) link.removeAttribute('href');
    return;
  }

  const text = (id, val)=>{ const el = document.getElementById(id); if (el) el.textContent = val; };
  // SERP: blank values until real click-through
  if (__journeyStage === 'serp'){
    ['traffic-source','utm-source','utm-medium','utm-campaign','utm-term','click-id','landing-page','original-number','tracking-number','campaign-type','tracking-mode'].forEach(id=>{ const el=document.getElementById(id); if(el) el.textContent='—'; });
    const link = document.getElementById('tracking-number-link'); if (link) link.removeAttribute('href');  return;
  }
  const utmSource = ({google:'google', facebook:'facebook', microsoft:'bing'})[state.source] || state.source || 'direct';
  const utmMedium = state.campaignType === 'paid' ? (state.source==='facebook' ? 'paid_social' : 'cpc') : (state.source==='facebook' ? 'social' : 'organic');
  const campaign = (config.attribution && config.attribution.utm_campaign) || '—';
  const term = (config.attribution && config.attribution.utm_term) || '';
  const lp = (config.attribution && config.attribution.landing_page_url) || (location.hostname + location.pathname);
  const campaignTypeLabel = state.campaignType === 'paid' ? 'Paid Search' : 'Organic Search';
  const trackingTypeLabel = state.trackingMode === 'channel' ? 'Channel Tracking' : 'Session Tracking';
  // Click ID rules
  const fbOrganicClid = (config.features && config.features.fbclidOnOrganic) ? true : false;
  let clickId = '—';
  if (state.source==='google' && state.campaignType==='paid') clickId = 'gclid=demo';
  else if (state.source==='microsoft' && state.campaignType==='paid') clickId = 'msclkid=demo';
  else if (state.source==='facebook' && (state.campaignType==='paid' || fbOrganicClid)) clickId = 'fbclid=demo';

  text('traffic-source', utmSource);
  text('utm-source', utmSource);
  text('utm-medium', utmMedium);
  text('utm-campaign', campaign);
  text('utm-term', term);
  text('click-id', clickId);
  text('landing-page', lp);
  text('campaign-type', campaignTypeLabel);
  text('tracking-mode', trackingTypeLabel);

  const tn = number || '—';
  const tnEl = document.getElementById('tracking-number');
  if (tnEl) tnEl.textContent = tn;
  const link = document.getElementById('tracking-number-link');
  if (link && number) link.setAttribute('href', 'tel:' + number.replace(/\D/g,''));
}


(function(){
  function markSite(){ setJourneyStage('site'); try{ const n = resolveNumber((window.__cfg||{}).dniRules||[], window.__state||{}); renderTrackingDetails(window.__cfg||{}, window.__state||{}, n); }catch(e){} }
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('a,button');
    if (!a) return;
    const href = (a.getAttribute('href')||'').toLowerCase();
    const txt  = (a.textContent||'').toLowerCase();
    if (a.matches('[data-nav="ad"], [data-nav="organic"], [data-action="visit-site"], .result-link, .serp a')) return markSite();
    if (href.includes('wellsfargo') || href.includes('bankco') || href.includes('closet') || href.includes('autodealer') || href.includes('insurance')) return markSite();
    if (txt.includes('open an account') || txt.includes('visit site') || txt.includes('learn more')) return markSite();
  }, true);
  document.addEventListener('click', (e)=>{
    const b = e.target.closest('[data-nav-back], .back-to-results, #back-to-results');
    if (b){ setJourneyStage('serp'); try { renderTrackingDetails(window.__cfg||{}, window.__state||{}, null);} catch(e){} }
  }, true);
})();











/*SERP<->SITE ACTIVATION*/
(function(){
  function activateSite(){
    __siteActivated = true;
    if (typeof setJourneyStage === 'function') setJourneyStage('site');
    try {
      const n = resolveNumber((window.__cfg||{}).dniRules||[], window.__state||{});
      renderTrackingDetails(window.__cfg||{}, window.__state||{}, n);
    } catch(e){}
  }
  function deactivateToSerp(){
    __siteActivated = false;
    if (typeof setJourneyStage === 'function') setJourneyStage('serp');
    try { renderTrackingDetails(window.__cfg||{}, window.__state||{}, null); } catch(e){}
  }

  // Only promote on explicit result/ad links
  const resultSelectors = [
    '[data-nav="ad"] a', '[data-nav="organic"] a',
    '.result-ad a', '.result-organic a',
    '[data-action="visit-site"]', '.visit-site', '.search-result a.result-link',
    '.serp a.result-link', '.serp .ad a'
  ].join(',');

  document.addEventListener('click', (e)=>{
    const link = e.target.closest(resultSelectors);
    if (link) activateSite();
  }, true);

  // Demote on "Back to results" or a visible Reset button
  document.addEventListener('click', (e)=>{
    if (e.target.closest('[data-nav-back], .back-to-results, #back-to-results')) return deactivateToSerp();
    const btn = e.target.closest('button, a');
    if (btn && /reset demo/i.test(btn.textContent||'')) return deactivateToSerp();
  }, true);

  // Force blanks on load
  deactivateToSerp();
})();
/*END SERP<->SITE ACTIVATION*/

