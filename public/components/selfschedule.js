
function setupSelfSchedule(formIds, actionConfig) {
  const forms = formIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!forms.length) return;

  /////// STORE FORM ANSWERS IN LOCAL STORAGE ///////
  const FIELD_IDS = [
    'First-Name','Last-Name','Email','Phone','Job-Title',
    'Company','City','State','Country'
  ];
  const STORAGE_KEY = 'leadInfo';

  const snapshot = (form) => {
    const data = {};
    FIELD_IDS.forEach((id) => {
      const el = form.querySelector(`#${id}`);
      if (el?.value) {
        const key = id.toLowerCase().replace(/-(.)/g, (_, c) => c.toUpperCase());
        data[key] = el.value.trim();
      }
    });
    return data;
  };

  const save = (form) => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const merged = { ...existing, ...snapshot(form), savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  };

  document.addEventListener('input', (e) => {
    if (forms.includes(e.target?.form)) save(e.target.form);
  });
  document.addEventListener('change', (e) => {
    if (forms.includes(e.target?.form)) save(e.target.form);
  });
  window.addEventListener('pagehide', () => forms.forEach(save));

  
  /////// CAMPAIGN LOGIC ///////
  const resolveActions = (form) =>
    typeof actionConfig === 'function' ? actionConfig(form) : actionConfig;

  const updateCampaign = (form) => {
    const orgSize = form.querySelector('#Organization-Size');
    const jobTitle = form.querySelector('#Job-Title');
    if (!orgSize || !jobTitle) return;

    const { default: defaultAction, special: specialAction } = resolveActions(form);
    const orgIndex = orgSize.selectedIndex;
    const jt = jobTitle.value;

    form.setAttribute('data-experiment', '1');

    if (jt === "Non-Staff" || jt === "Employee" || jt === "Ministry Leader") {
      form.action = defaultAction;
    } else if (orgIndex <= 1) {
      form.action = specialAction;
    } else {
      form.action = defaultAction;
    }
  };

  forms.forEach(updateCampaign);
  document.addEventListener('change', (e) => {
    if ((e.target.id === 'Organization-Size' || e.target.id === 'Job-Title') && forms.includes(e.target.form)) {
      updateCampaign(e.target.form);
    }
  });
}

const PREFIX = "https://go.rightnowmedia.org/l/964643/";


export function selfScheduleUS(formIds) {
  const resolver = (form) => {
    const id = form.id;
    const base = `${PREFIX}${window.formURLS[id]}`;
    const calendly = `${PREFIX}${window.formURLS[`${id}_Calendly`]}`;
    return { default: base, special: calendly };
  };

  setupSelfSchedule(formIds, resolver);
}


////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////




function initCalendlyWidget(baseUrl) {
  const STORAGE_KEY = 'leadInfo';

  // tiny helper: run after DOM is ready
  function whenDOMReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  }

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

    return parts.length ? `${baseUrl}?${parts.join('&')}` : baseUrl;
  }

  function initCalendly(url) {
    function go() {
      const parentElement = document.getElementById('calendly-container');
      if (!parentElement) return false; // wait until container exists

      if (window.Calendly?.initInlineWidget) {
        // optional: clear stale content if any
        parentElement.innerHTML = '';
        window.Calendly.initInlineWidget({ url, parentElement });
        return true;
      }
      return false;
    }

    if (!go()) {
      const t = setInterval(() => go() && clearInterval(t), 50);
      setTimeout(() => clearInterval(t), 10000);
    }
  }

  // Defer the whole thing until DOM is ready (fixes first-load race)
  whenDOMReady(() => {
    const data = getLead();
    const url = buildUrl(data);
    initCalendly(url);
  });

  // clear lead info after booking
  window.addEventListener('message', (e) => {
    if (e.data?.event === 'calendly.event_scheduled') {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  });
}

// Media US
export function selfScheduleUSSuccess() {
  initCalendlyWidget('https://calendly.com/rightnowmedia/rnm-demonstration');
}

// Pastors+ US
export function selfSchedulePPlusUSSuccess() {
  initCalendlyWidget('https://calendly.com/rnmp/pastorsplus');
}
