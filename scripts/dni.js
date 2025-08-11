
import { $$ } from './utils/dom.js';
export function resolveNumber(rules, ctx){
  // Support simple equality + optional {$in: []}
  const match = rules.find(r => Object.entries(r.when).every(([k,v]) => {
    if (v && typeof v === 'object' && Array.isArray(v.$in)) return v.$in.includes(ctx[k]);
    return ctx[k] === v;
  }));
  return match ? match.number : null;
}
export function applyToDom(number){
  if(!number) return;
  const targets = [
    '#initiate-number','#navigate-number','#optimize-number',
    '[data-dni]','a[data-dni-link]'
  ];
  targets.forEach(sel => $$(sel).forEach(el => {
    if(el.tagName === 'A'){
      el.textContent = number;
      el.setAttribute('href', `tel:${number.replace(/\D/g,'')}`);
    } else {
      el.textContent = number;
    }
  }));
}
