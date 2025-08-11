
export const mapSource = s => (s==='microsoft' ? 'bing' : (s||'direct'));
export function resolveMedium(source, campaignType){ return source==='facebook' ? (campaignType==='paid'?'paid_social':'social') : (campaignType==='paid'?'cpc':'organic'); }
export function resolveNumber(rules,{source,medium}){ const src=mapSource(source); const hit=(rules||[]).find(r=>(!r.when?.source||r.when.source===src)&&(!r.when?.medium||r.when.medium===medium))||(rules||[]).find(r=>(r.when||{}).source==='direct'); return (hit&&hit.number)||''; }
