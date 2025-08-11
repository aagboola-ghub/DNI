
import { loadConfig } from './config.js';
import { initState } from './state.js';
import { Templates } from './templates.js';
import { Router } from './router.js';
import { renderTracking } from './trackingPanel.js';
import { initSerpLock } from './serpLock.js';
import { initAnalytics } from './analytics.js';

export async function boot(configUrl){
  const cfg = await loadConfig(configUrl);
  const state = initState(cfg.defaults);
  const tpl = new Templates('#app');
  await tpl.mount('pages/serp.html','pages/landing.html','pages/checking.html','pages/partials/controls.html');
  const router = new Router(state, tpl);
  router.onChange(()=> renderTracking(cfg, state));
  initSerpLock(state, cfg);
  initAnalytics(state, cfg);
  renderTracking(cfg, state);
}
