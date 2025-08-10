import { loadConfig } from './config/loader.js';
import { applyTheme } from './utils/theme.js';
import * as Router from './router.js';
import { mountNavbar } from './ui/navbar.js';
import { mountCallPanel } from './ui/call-panel.js';
import { mountAnalyticsPanel } from './ui/analytics-panel.js';
import { setMany } from './store.js';
import { on, track } from './mock-tracking.js';
import { applyDni } from './dni.js';

const cfg = await loadConfig();
applyTheme(cfg);

// initialize state
const d = cfg.presets?.default || {};
setMany({
  source: d.source || 'google',
  campaignType: d.campaignType || 'paid',
  trackingMode: d.trackingMode || 'session'
});

mountNavbar(document.getElementById('nav'), cfg);
await Router.start(document.getElementById('page'), cfg);

// listen to router on window (not the mock bus)
window.addEventListener('router:navigated', () => {
  const page = location.hash.slice(1) || cfg.navigation[0].id;
  track('page:view', { page });
  applyDni(cfg.dniRules);
});

// recompute on state changes from the mock bus
on('state:update', () => applyDni(cfg.dniRules));

// first paint
applyDni(cfg.dniRules);

mountCallPanel(document.getElementById('callPanel'), cfg);
mountAnalyticsPanel(document.getElementById('analyticsPanel'), cfg);
