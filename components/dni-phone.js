import { evaluateNumber } from '../core/dni-engine.js';

class DniPhone extends HTMLElement{
  connectedCallback(){
    this.render = this.render.bind(this);
    window.addEventListener('context-updated', this.render);
    this.render();
  }
  disconnectedCallback(){
    window.removeEventListener('context-updated', this.render);
  }
  render(){
    const st = window.appState;
    if(!st?.profile || !st?.context) return;
    const { phone } = evaluateNumber(st.profile, st.context);
    const link = this.closest('a[href^="tel:"]');
    if(link){ link.setAttribute('href', `tel:${phone.replace(/[^\d+]/g,'')}`); }
    this.textContent = phone || '';
  }
}
customElements.define('dni-phone', DniPhone);
