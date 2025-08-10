
import { state } from './store.js';
export function resolveNumber(rules, s){
  const r = rules.find(r => Object.entries(r.when).every(([k,v]) => s[k]===v));
  return r ? r.number : null;
}
export function applyDni(rules){
  const num = resolveNumber(rules, state);
  if (num){
    document.querySelectorAll('[data-dni]').forEach(el => {
      el.textContent = num;
      if (el.hasAttribute('data-dni-link')) el.setAttribute('href', `tel:${num.replace(/\D/g,'')}`);
    });
  }
  return num;
}
