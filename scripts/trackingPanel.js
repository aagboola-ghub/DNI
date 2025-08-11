
import { resolveMedium, mapSource, resolveNumber } from './dni.js';
export function renderTracking(cfg,state){
  const set=(id,v)=>{const el=document.getElementById(id); if(el) el.textContent=v;};
  if(state.stage==='serp') return;
  const utmSource = mapSource(state.source);
  const utmMedium = resolveMedium(state.source, state.campaignType);
  const attr = cfg.attribution||{};
  const clickId = (state.source==='google'&&state.campaignType==='paid')?'gclid=demo'
    : (state.source==='microsoft'&&state.campaignType==='paid')?'msclkid=demo'
    : (state.source==='facebook'&&(state.campaignType==='paid'||cfg.features?.fbclidOnOrganic))?'fbclid=demo':'—';
  set('traffic-source', utmSource); set('utm-source', utmSource); set('utm-medium', utmMedium);
  set('utm-campaign', state.campaignType==='paid' ? (attr.utm_campaign||'—') : '—');
  set('utm-term', attr.utm_term || (utmMedium==='organic' ? '—' : ''));
  set('click-id', clickId);
  set('landing-page', state.landingUrl || (attr.landing_page_url || (location.hostname+location.pathname)));
  set('campaign-type', state.campaignType==='paid'?'Paid Search':'Organic Search');
  set('tracking-mode', state.trackingMode==='channel'?'Channel Tracking':'Session Tracking');
  const number = resolveNumber(cfg.dniRules, {source: state.source, medium: utmMedium});
  state.trackingNumber = number;
  set('tracking-number', number || 'Not yet assigned');
  const a=document.getElementById('tracking-number-link'); if(a && number) a.setAttribute('href','tel:'+number.replace(/\D/g,''));
}
