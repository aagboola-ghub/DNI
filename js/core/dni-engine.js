import RULES from "../config/rules.js";
import { BRAND } from "../config/index.js";
import { getState, patch, pushEvent } from "../store.js";

function inList(val, x){ return Array.isArray(val) ? val.includes(x) : val === x; }
function match(rule, ctx){
  if (rule.when?.any) return true;
  if (rule.when.source && !inList(rule.when.source, ctx.utm.source)) return false;
  if (rule.when.medium && !inList(rule.when.medium, ctx.utm.medium)) return false;
  if (rule.when.campaignContains && !ctx.utm.campaign.toLowerCase().includes(rule.when.campaignContains)) return false;
  return true;
}

export function assignNumbers(){
  const ctx = getState();
  const rules = BRAND.rulesOverride ?? RULES;
  const assigned = { ...ctx.assigned };
  for (const r of rules){
    if (match(r, ctx)){
      const s = r.assign.surface;
      assigned[s] = r.assign.number ?? BRAND.phoneSurfaces[s]?.default ?? null;
    }
  }
  // ensure every surface has a value
  for (const id of Object.keys(BRAND.phoneSurfaces)){
    if (!assigned[id]) assigned[id] = BRAND.phoneSurfaces[id].default;
  }
  patch({ assigned });
  pushEvent({ type:"rule-apply", utm:ctx.utm, assigned });
  return assigned;
}
