import { BRAND } from "../config/index.js";

export function applyBrandTokens(){
  const r = document.documentElement.style;
  const t = BRAND.tokens;
  r.setProperty("--brand-primary", t.colorPrimary);
  r.setProperty("--brand-accent",  t.colorAccent);
  r.setProperty("--brand-dark",    t.colorDark);
  r.setProperty("--brand-on-primary", t.textOnPrimary);
}

export default function mountHero(target){
  target.innerHTML = `
    <div class="jumbotron">
      <img src="assets/img/${BRAND.assets.logo}" alt="${BRAND.name}" style="height:40px" class="mb-2"/>
      <h1 class="display-5">${BRAND.content.heroHeadline}</h1>
      <p class="lead">${BRAND.content.heroSub}</p>
      <div class="flex">
        <a data-dni="primary" class="btn btn-brand" href="tel:8005550100">(800) 555-0100</a>
        <a data-dni="support" class="btn btn-outline ml-2" href="tel:8005550200">(800) 555-0200</a>
      </div>
    </div>
  `;
}
