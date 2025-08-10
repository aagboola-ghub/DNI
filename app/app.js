import { Router } from './router.js';
import { loadProfile, setTheme, getProfileIdFromURL } from './profile.js';
import { createAdapter } from '../adapters/create-adapter.js';

import '../components/brand-header.js';
import '../components/journey-sim.js';
import '../components/dni-phone.js';
import '../components/analytics-panel.js';
import '../components/call-sim.js';
import '../components/session-view.js';

window.appState = {
  profile: null,
  context: { source:'google', campaignType:'paid', trackingMode:'session', pageId:'home' },
  adapter: null,
  router: null
};

async function init(){
  // Determine profile
  const profileId = getProfileIdFromURL() || 'wells-fargo';
  const profile = await loadProfile(profileId);
  window.appState.profile = profile;
  setTheme(profile.brand?.tokens || {});

    // Adapter (deterministic mock only)
  window.appState.adapter = await createAdapter(window.appState.profile);

  // Router
  const router = new Router('#page-slot', window.appState);
  window.appState.router = router;
  router.start();

  // Wire context updates from journey-sim
  window.addEventListener('context-changed', (e)=>{
    Object.assign(window.appState.context, e.detail);
    window.dispatchEvent(new CustomEvent('context-updated', { detail: window.appState.context }));
    // track page on context changes
    window.appState.adapter?.trackPage?.(window.appState.context);
  });

  // Initial track
  window.appState.adapter?.trackPage?.(window.appState.context);
}
init();
