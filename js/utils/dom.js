export const qs = (sel, ctx=document) => ctx.querySelector(sel);
export const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
export function el(html){ const t=document.createElement('template'); t.innerHTML=html.trim(); return t.content.firstElementChild; }
export function mount(node, target){ target.replaceChildren(node); }
export function fmtNum(n){ return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
export function nowISO(){ return new Date().toISOString(); }
export function randId(prefix){ return prefix + '-' + Math.random().toString(36).slice(2,10); }
