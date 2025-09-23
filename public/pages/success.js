

//////////// SHARED ON ALL SUCCESS PAGES ////////////


export function successAllPages() {

  // Remove Hidden Stuff, ie. other regional navigations
  document.querySelectorAll(".w-condition-invisible").forEach(el => el.remove());


  // Remove Get Access and Login Buttons

  document.querySelectorAll(".navigation").forEach(nav => {
    const getAccessBtn = nav.querySelector(".header-nav-get-access");
    const loginLink = nav.querySelector("#NavLink_US_Login");

    if (getAccessBtn) getAccessBtn.remove();
    if (loginLink) loginLink.remove();
  });

}



//////////// Calendly Success Page ////////////
/*
export function successUSCalendly() {

  const STORAGE_KEY = 'leadInfo';
  const EVENT_BASE_URL = 'https://calendly.com/angeloterminel/sample-30min';

  function getLead() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { return {}; }
  }

  function buildUrl(d) {
    const name  = [d.firstName || '', d.lastName || ''].join(' ').trim();
    const email = d.email || '';
    const custom = [d.phone, d.jobTitle, d.company, d.city, d.state]; // a1..a5

    const parts = [];
    if (name)  parts.push(`name=${encodeURIComponent(name)}`);
    if (email) parts.push(`email=${encodeURIComponent(email)}`);
    custom.forEach((v, i) => { if (v) parts.push(`a${i + 1}=${encodeURIComponent(v)}`); });

    return parts.length ? `${EVENT_BASE_URL}?${parts.join('&')}` : EVENT_BASE_URL;
  }

  function initCalendly(url) {
    function go() {
      if (window.Calendly?.initInlineWidget) {
        window.Calendly.initInlineWidget({
          url,
          parentElement: document.getElementById('calendly-container')
        });
        return true;
      }
      return false;
    }
    if (!go()) {
      const t = setInterval(() => go() && clearInterval(t), 50);
      setTimeout(() => clearInterval(t), 10000);
    }
  }

  const data = getLead();
  const url = buildUrl(data);
  initCalendly(url);

  window.addEventListener('message', (e) => {
    if (e.data?.event === 'calendly.event_scheduled') {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  });
}
  */