
export const defaults = {
  presets: { trafficSources: ["google","facebook","microsoft"], trackingModes:["session","channel"],
    default: { source:"google", campaignType:"paid", trackingMode:"session" } }
};
export function applyDefaults(cfg){ return Object.assign({}, defaults, cfg); }
