
import { setText } from './utils/dom.js';
import { resolveNumber, applyToDom } from './dni.js';
import { emit } from './telemetry.js';

export function bind(config, state){
  // Branding (optional): you can swap logos/text here if the DOM has targets
  // Colors
  const r = document.documentElement.style;
  const p = config.palette || {};
  Object.entries(p).forEach(([k,v]) => r.setProperty(`--${k}`, v));
  if (sidEl && sidEl.closest) {
    const row = sidEl.closest('tr'); if (row) row.remove();
  }
  document.querySelectorAll('h6').forEach(h => {
    if (h.textContent && h.textContent.trim().toLowerCase() === 'marchex ai insights') {
      const card = h.nextElementSibling;
      if (card && card.classList && card.classList.contains('card')) card.remove();
      h.remove();
    }
  });


  // Initial UTM/session display
  updateSession(config, state);
  updateNumber(config, state);

  // Buttons in the existing left panel carry data-* attributes
  document.querySelectorAll('[data-source]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.source = btn.getAttribute('data-source');
      markActive('[data-source]', btn);
      updateSession(config, state);
      updateNumber(config, state);
      emit('context:source', { source: state.source });
    });
  });
  document.querySelectorAll('[data-campaign]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.campaignType = btn.getAttribute('data-campaign');
      markActive('[data-campaign]', btn);
      updateSession(config, state);
      updateNumber(config, state);
      emit('context:campaign', { campaignType: state.campaignType });
    });
  });
  document.querySelectorAll('[data-tracking]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.trackingMode = btn.getAttribute('data-tracking');
      markActive('[data-tracking]', btn);
      emit('context:tracking', { trackingMode: state.trackingMode });
    });
  });

  const reset = document.getElementById('reset-demo');
  if (reset) reset.addEventListener('click', () => {
    Object.assign(state, config.presets?.default || {});
    document.querySelectorAll('[data-source],[data-campaign],[data-tracking]').forEach(b=>b.classList.remove('active'));
    // re-activate buttons matching defaults
    activateMatching('[data-source]', state.source);
    activateMatching('[data-campaign]', state.campaignType);
    activateMatching('[data-tracking]', state.trackingMode);
    updateSession(config, state);
    updateNumber(config, state);
    emit('reset', { state });
  });

  // Call simulators (existing buttons)
  ['simulate-call-initiate','simulate-call','simulate-call-optimize'].forEach(id => {
    const b = document.getElementById(id); if(!b) return;
    b.addEventListener('click', () => {
      emit('call:start', { page: id });
      setTimeout(()=> emit('call:end', { page: id, sentiment: 'positive' }), 500);
    });
  });
}

function updateSession(config, state){
  // Update visible session/utm placeholders present in your HTML
  setText('traffic-source', state.source || '');
  setText('utm-source', state.source || '');
  setText('utm-medium', state.campaignType === 'paid' ? 'cpc' : 'organic');
  // utm-campaign/term left as-is unless you want mapping from config
}

function updateNumber(config, state){
  const number = resolveNumber(config.dniRules || [], state);
  applyToDom(number);
}

function markActive(sel, activeEl){
  document.querySelectorAll(sel).forEach(b=>b.classList.remove('active'));
  activeEl.classList.add('active');
}

function activateMatching(sel, val){
  const el = Array.from(document.querySelectorAll(sel)).find(b => 
    b.getAttribute(sel.slice(1, sel.indexOf(']'))) === val
  );
  if (el) el.classList.add('active');
}


// Reflect in left panel tracking number
const __origUpdate = updateNumber;
updateNumber = function(config, state){
  const number = resolveNumber(config.dniRules || [], state);
  applyToDom(number);
  const ids = ['tracking-number','tracking-number-value','trackingNumber','tracking_number'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = number || 'Not yet assigned'; });
  const link = document.getElementById('tracking-number-link');
  if (link && number) link.setAttribute('href', `tel:${number.replace(/\D/g,'')}`);
};