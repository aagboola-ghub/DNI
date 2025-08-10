
import { loadConfig } from './scripts/config/loader.js';
import { applyTheme } from './scripts/utils/theme.js';
import * as Router from './scripts/router.js';
import { mountNavbar } from './scripts/ui/navbar.js';
import { mountCallPanel } from './scripts/ui/call-panel.js';
import { mountAnalyticsPanel } from './scripts/ui/analytics-panel.js';
import { setMany } from './scripts/store.js';
import { on, track } from './scripts/mock-tracking.js';
import { applyDni } from './scripts/dni.js';

const cfg = await loadConfig();
applyTheme(cfg);
const d = cfg.presets?.default || {};
setMany({ source:d.source||'google', campaignType:d.campaignType||'paid', trackingMode:d.trackingMode||'session' });
mountNavbar(document.getElementById('nav'), cfg);
await Router.start(document.getElementById('page'), cfg);
on('router:navigated', () => { track('page:view', { page: location.hash.slice(1) }); applyDni(cfg.dniRules); });
on('state:update', () => applyDni(cfg.dniRules));
applyDni(cfg.dniRules);
mountCallPanel(document.getElementById('callPanel'), cfg);
mountAnalyticsPanel(document.getElementById('analyticsPanel'), cfg);
