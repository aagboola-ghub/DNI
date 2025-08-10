export function getProfileIdFromURL(){
  const p = new URLSearchParams(location.search).get('profile');
  return p && /^[a-z0-9-]+$/i.test(p) ? p : null;
}
export async function loadProfile(id){
  const res = await fetch(`./profiles/${id}.json`);
  if(!res.ok) throw new Error(`Profile not found: ${id}`);
  return res.json();
}
export function setTheme(tokens){
  const root = document.documentElement;
  Object.entries(tokens || {}).forEach(([k,v])=> root.style.setProperty(k,v));
}
