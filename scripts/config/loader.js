
export async function loadConfig(){
  const params = new URLSearchParams(location.search);
  const id = params.get('config') || 'wells-fargo';
  const res = await fetch(`./configs/${id}.json`);
  if(!res.ok) throw new Error(`Config not found: ${id}`);
  return await res.json();
}
