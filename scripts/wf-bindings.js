/* wf-bindings.js — deterministic SERP blanking + friendly Call Analytics */

(function () {
  // ---- Utilities
  const $ = (sel, root = document) => root.querySelector(sel);
  const text = (id, val) => { const n = document.getElementById(id); if (n) n.textContent = val; };
  const dashAll = () => {
    [
      'traffic-source','utm-source','utm-medium','utm-campaign','utm-term',
      'click-id','landing-page','original-number','tracking-number',
      'campaign-type','tracking-mode'
    ].forEach(id => text(id, '—'));
    const link = document.getElementById('tracking-number-link');
    if (link) link.removeAttribute('href');
  };
  const isSerp = () =>
    !!(document.querySelector('.serp, [data-page="serp"], .search-results'));

  // ---- Public API (kept names so other scripts keep working)
  window.renderTrackingDetails = function renderTrackingDetails(config, state, number) {
    // HARD GUARD: if SERP is visible, never populate — keep all dashes
    if (isSerp()) { dashAll(); return; }

    // SITE population
    const mapSource = { google: 'google', microsoft: 'bing', facebook: 'facebook' };
    const utmSource = mapSource[(state && state.source) || ''] || (state && state.source) || 'direct';
    const paid = (state && state.campaignType) === 'paid';
    const fb = ((state && state.source) === 'facebook');
    const utmMedium = paid ? (fb ? 'paid_social' : 'cpc') : (fb ? 'social' : 'organic');
    const attr = (config && config.attribution) || {};
    const campaign = attr.utm_campaign || '—';
    const term = attr.utm_term || '';
    const lp = attr.landing_page_url || (location.hostname + location.pathname);

    let clickId = '—';
    if ((state && state.source) === 'google' && paid) clickId = 'gclid=demo';
    if ((state && state.source) === 'microsoft' && paid) clickId = 'msclkid=demo';
    if ((state && state.source) === 'facebook' && (paid || ((config.features || {}).fbclidOnOrganic === true))) clickId = 'fbclid=demo';

    text('traffic-source', utmSource);
    text('utm-source', utmSource);
    text('utm-medium', utmMedium);
    text('utm-campaign', campaign);
    text('utm-term', term);
    text('click-id', clickId);
    text('landing-page', lp);
    text('campaign-type', state && state.campaignType ? (paid ? 'Paid Search' : 'Organic Search') : '—');
    text('tracking-mode', state && state.trackingMode ? (state.trackingMode === 'channel' ? 'Channel Tracking' : 'Session Tracking') : '—');

    const tn = number || '—';
    text('tracking-number', tn);
    const link = document.getElementById('tracking-number-link');
    if (link && number) link.setAttribute('href', 'tel:' + number.replace(/\D/g, ''));
  };

  window.updateNumber = function updateNumber(config, state) {
    // HARD GUARD: never write on SERP
    if (isSerp()) { dashAll(); return; }
    let number = '';
    try { number = resolveNumber(((config || {}).dniRules) || [], state || {}); } catch (e) {}
    try { renderTrackingDetails(config, state, number); } catch (e) {}
    if (number && typeof applyToDom === 'function') { try { applyToDom(number); } catch (e) {} }
  };

  // ---- Activation/Back wiring (purely to force re-render at the right time)
  document.addEventListener('click', (e) => {
    // Promote to SITE after clicking an actual result/ad link
    const resultLink = e.target.closest(
      '[data-nav="ad"] a, [data-nav="organic"] a, ' +
      '.result-ad a, .result-organic a, ' +
      '[data-action="visit-site"], .visit-site, ' +
      '.search-result a.result-link, .serp a.result-link, .serp .ad a'
    );
    if (resultLink) {
      // Give the DOM a tick to swap to the site pane, then populate
      setTimeout(() => {
        try { updateNumber(window.__cfg || {}, window.__state || {}); } catch (e) { dashAll(); }
      }, 0);
    }

    // Back to SERP or Reset → force dashes again
    if (e.target.closest('[data-nav-back], .back-to-results, #back-to-results')) {
      setTimeout(() => dashAll(), 0);
    }
    const btn = e.target.closest('button, a');
    if (btn && /reset demo/i.test(btn.textContent || '')) {
      setTimeout(() => dashAll(), 0);
    }
  }, true);

  // ---- Friendly Call Analytics (left card + modal)
  function fmtPhone(s) {
    const d = (s || '').replace(/[^\d]/g, '');
    if (d.length === 11 && d[0] === '1') return `+1 ${d.slice(1, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
    if (d.length === 10) return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
    return s || '';
  }
  function readCell(id) { return (document.getElementById(id)?.textContent || '').trim(); }

  function renderFriendlyAnalytics(payload) {
    const items = [
      ['The UTM campaign', payload.attribution_details.utm_campaign],
      ['The UTM source', payload.attribution_details.utm_source],
      ['The UTM medium', payload.attribution_details.utm_medium],
      ['The UTM term/keyword', payload.attribution_details.utm_term],
      ['The UTM content', payload.attribution_details.utm_content || ''],
      ['The landing page URL', payload.attribution_details.landing_page_url],
      ['Start date and time', new Date(payload.start_time).toLocaleString()],
      ['Duration of call in seconds', String(payload.call_duration)],
      ['Tracking number', fmtPhone(payload.tracking_number)],
      ["Caller's phone number", fmtPhone(payload.caller_number)]
    ];
    const html = items.map(([k, v]) =>
      `<div class="d-flex justify-content-between border-bottom py-1">
         <div class="me-3"><strong>${k}</strong></div>
         <div class="text-break">${v || ''}</div>
       </div>`).join('');

    const leftBody = document.getElementById('call-analytics-body');
    if (leftBody) {
      leftBody.innerHTML = html;
      const card = document.getElementById('call-analytics-card');
      if (card) card.style.display = '';
    }
    const modalBody = document.querySelector('.modal.show .modal-body');
    if (modalBody) modalBody.innerHTML = html;
  }

  // Hook your existing simulate-call trigger if available, else fallback to DOM read
  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-simulate-call], #simulate-call')) {
      try {
        const payload = {
          attribution_details: {
            utm_campaign: readCell('utm-campaign') || '—',
            utm_source:   readCell('utm-source')   || '—',
            utm_medium:   readCell('utm-medium')   || '—',
            utm_term:     readCell('utm-term')     || '',
            utm_content:  '', // optional
            landing_page_url: readCell('landing-page') || (location.hostname + location.pathname)
          },
          start_time: new Date().toISOString(),
          call_duration: 268,
          tracking_number: readCell('tracking-number') || '',
          caller_number: '+15559876543'
        };
        renderFriendlyAnalytics(payload);
      } catch (e2) { /* swallow */ }
    }
  }, true);

  // First paint: force SERP blanks
  document.addEventListener('DOMContentLoaded', dashAll);
  // In case scripts load late, run once now
  try { dashAll(); } catch (e) {}
})();
