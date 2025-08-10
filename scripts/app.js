
import { loadConfig } from './config/loader.js';
import { bind } from './wf-bindings.js';

const cfg = await loadConfig();
const defaults = cfg.presets?.default || { source:'google', campaignType:'paid', trackingMode:'session' };
const state = { ...defaults };

bind(cfg, state);
