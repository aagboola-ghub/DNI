
import { applyDefaults } from './schema.js';
export async function loadConfig(){
  const params = new URLSearchParams(location.search);
  const id = params.get('config') || 'wells-fargo';
  const res = await fetch(`./configs/${id}.json`);
  if(!res.ok) throw new Error(`Config not found: ${id}`);
  const cfg = await res.json();
  if(!cfg.branding || !cfg.navigation || !cfg.dniRules) throw new Error('Invalid config file');
  return applyDefaults(cfg);
}
