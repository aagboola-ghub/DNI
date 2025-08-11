import { getState, pushEvent } from "../store.js";
import { el, mount } from "../utils/dom.js";

function randomPhone(){
  const n = () => Math.floor(Math.random()*10);
  return `(${n()}${n()}${n()}) ${n()}${n()}${n()}-${n()}${n()}${n()}${n()}`;
}

export default function CallSim(root){
  const node = el(`
    <div class="card card-body">
      <h5 class="mb-2">Call Simulator</h5>
      <div class="grid-2">
        <div>
          <label>Caller Number</label>
          <input id="caller" class="form-control" placeholder="(555) 010-2025" />
        </div>
        <div>
          <label>Duration (sec)</label>
          <input id="dur" type="number" min="5" max="900" value="120" class="form-control" />
        </div>
      </div>
      <div class="flex mt-3">
        <button id="simulate" class="btn btn-brand">Simulate Call</button>
      </div>
    </div>
  `);
  mount(node, root);
  node.querySelector("#caller").value = randomPhone();

  node.querySelector("#simulate").addEventListener("click", () => {
    const s = getState();
    if (s.stage !== "landing"){ alert("Navigate to Landing state first (click Visit Site)."); return; }
    const caller = node.querySelector("#caller").value.trim() || randomPhone();
    const duration = Math.max(5, parseInt(node.querySelector("#dur").value||"120",10));
    pushEvent({
      type: "call",
      caller,
      duration,
      trackingNumber: s.assigned.primary,
      utm: s.utm,
      landingUrl: s.landingUrl,
      startedAt: new Date().toISOString()
    });
  });
}
