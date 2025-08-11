
export function initState(defaults={}){
  return { source: defaults.source||'google', campaignType: defaults.campaignType||'paid', trackingMode: defaults.trackingMode||'session', stage:'serp', clickId:null, landingUrl:null, trackingNumber:null };
}
