export function evaluateNumber(profile, context){
  for(const rule of profile.dniRules || []){
    if(matches(rule.when || {}, context)){
      const key = rule.number;
      return { ruleId: rule.id, phone: (profile.numbers?.[key]) || profile.numbers?.default };
    }
  }
  return { ruleId: 'fallback', phone: profile?.numbers?.default };
}
function matches(when, ctx){
  return Object.entries(when).every(([k,v])=> v==null ? true : ctx?.[k] === v);
}
