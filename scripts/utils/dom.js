
export const $ = (sel, el=document) => el.querySelector(sel);
export const $$ = (sel, el=document) => Array.from(el.querySelectorAll(sel));
export function setText(id, text){ const el = (typeof id==='string')?document.getElementById(id):id; if(el) el.textContent = text; }
export function setHref(id, tel){ const el=document.getElementById(id); if(el) el.setAttribute('href', `tel:${tel.replace(/\D/g,'')}`); }
