import { getState } from "../store.js";

export function replaceDOM(){
  const { assigned } = getState();
  document.querySelectorAll("[data-dni]").forEach(el => {
    const id = el.getAttribute("data-dni");
    const num = assigned[id];
    if (!num) return;
    el.textContent = num;
    const digits = num.replace(/\D/g, "");
    if (el.tagName === "A") el.setAttribute("href", `tel:${digits}`);
    el.classList.add("changed-row");
    setTimeout(()=>el.classList.remove("changed-row"), 400);
  });
}
