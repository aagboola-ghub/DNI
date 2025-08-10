
export function mountNavbar(root, cfg){
  const first = cfg.navigation[0].id;
  const links = cfg.navigation.map(n => `<li class="nav-item mr-3"><a class="nav-link text-white" href="#${n.id}">${n.label}</a></li>`).join('');
  root.innerHTML = `
  <nav class="navbar navbar-dark wf-navbar">
    <div class="container-fluid">
      <a class="navbar-brand" href="#${first}">
        <div class="stagecoach"></div>
        <span class="font-weight-bold">Wells Fargo</span> Business Banking
      </a>
      <ul class="navbar-nav flex-row">${links}</ul>
    </div>
  </nav>`;
}
