
import { loadConfig } from './config/loader.js';
import { bind } from './wf-bindings.js';

const cfg = await loadConfig();
const defaults = cfg.presets?.default || { source:'google', campaignType:'paid', trackingMode:'session' };
const state = { ...defaults };

bind(cfg, state);
import('./wf-bindings.js').then(m=>{ try { m.setJourneyStage && m.setJourneyStage('serp'); m.renderTrackingDetails && m.renderTrackingDetails(cfg, state, null); } catch(e){} });
