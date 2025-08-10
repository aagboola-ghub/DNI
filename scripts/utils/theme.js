
export function applyTheme(cfg){
  const r = document.documentElement.style;
  const p = Object.assign({}, cfg.palette);
  for(const [k,v] of Object.entries(p)){ r.setProperty(`--${k}`, v); }
  if (cfg.typography?.fallback){
    document.documentElement.style.setProperty('--font-body', cfg.typography.fallback);
  }
}
