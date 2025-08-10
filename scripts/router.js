
export async function start(outlet, cfg){
  async function render(){
    const id = (location.hash.replace('#','') || cfg.navigation[0].id);
    const item = cfg.navigation.find(n => n.id === id) || cfg.navigation[0];
    const res = await fetch(`./pages/${item.page}`);
    const html = await res.text();
    outlet.innerHTML = html;
    document.title = `${cfg.meta?.label || 'DNI Demo'} — ${item.label}`;
    dispatchEvent(new CustomEvent('router:navigated', { detail:{ id } }));
  }
  addEventListener('hashchange', render);
  await render();
}
