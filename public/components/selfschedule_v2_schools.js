
////////////// Self-Schedule //////////////

// Form Requirements:
// *Must be Web-to-Lead
// *Needs .selfschedule-configuration class
// *Needs Title field
// *Needs State field

const BUCKET_ONE_STATES = new Set([
  "Alabama", "Arkansas", "Colorado", "Florida", "Georgia", "Kansas", "Kentucky",
  "Louisiana", "Mississippi", "Missouri", "North Carolina", "Oklahoma",
  "South Carolina", "Tennessee", "Texas", "Virginia"
]);

function setupSelfSchedule() {
  // Automatically find all forms that have .selfschedule-configuration
  const forms = Array.from(document.querySelectorAll('form'))
    .filter((form) => form.querySelector('.selfschedule-configuration'));

  if (!forms.length) return;

  console.log("Self-Schedule Active");

  const LIVE_FIELD_IDS = ['first_name', 'last_name', 'email'];

  const qs = (root, sel) => root.querySelector(sel);
  const val = (form, sel) => (qs(form, sel)?.value || '').trim();

  // Safely append query string to base URL (keeps #hash at the end)
  const appendQuery = (base, qstring) => {
    if (!qstring) return base;
    const [beforeHash, hash = ''] = base.split('#');
    const sep = beforeHash.includes('?') ? '&' : '?';
    const out = beforeHash + (qstring ? `${sep}${qstring}` : '');
    return hash ? `${out}#${hash}` : out;
  };

  const buildRetURL = (base, form) => {
    const first = val(form, '#first_name');
    const last  = val(form, '#last_name');
    const email = val(form, '#email');
    const name  = [first, last].filter(Boolean).join(' ').trim();
    const q = `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    return appendQuery(base, q);
  };

  const readConfig = (form) => {
    // Double-check this form has .selfschedule-configuration
    const cfg = form.querySelector('.selfschedule-configuration');
    const text = (sel) => (qs(cfg, sel)?.textContent || '').trim() || null;

    return {
      returl: {
        default: text('.selfschedule-returl-default'),
        one:     text('.selfschedule-returl-1'),
        two:     text('.selfschedule-returl-2'),
      },
    };
  };

  function updateRetUrl(form) {
    const cfgRoot = form.querySelector('.selfschedule-configuration');
    if (!cfgRoot) return;

    const config = readConfig(form);

    const stateEl  = qs(form, '#state');
    const jobTitle = qs(form, '#title');
    if (!jobTitle) return;

    const jt = jobTitle.value;

    let bucket;

    if (jt === 'Non-Staff' || jt === 'Employee' || jt === 'Ministry Leader') {
      bucket = 'default';
    } else {
      if (stateEl) {
        const stateValue = stateEl.value;
        bucket = BUCKET_ONE_STATES.has(stateValue) ? 'one' : 'two';
      } else {
        bucket = 'default';
      }
    }

    const successBase = config.returl[bucket];
    const retUrlEl   = qs(form, '#retURL') || qs(form, '[name="retURL"]');
    if (retUrlEl && successBase)  retUrlEl.value = buildRetURL(successBase, form);
  }

  forms.forEach(updateRetUrl);

  document.addEventListener('change', (e) => {
    if (!forms.includes(e.target?.form)) return;
    if (e.target.id === 'state' || e.target.id === 'title') {
      updateRetUrl(e.target.form);
    }
  });

  document.addEventListener('input', (e) => {
    if (!forms.includes(e.target?.form)) return;
    if (LIVE_FIELD_IDS.includes(e.target.id)) {
      updateRetUrl(e.target.form);
    }
  });
}

////////////// Calendly Prefill //////////////

function setupCalendlyPrefill() {
  const widget = document.querySelector(".calendly-inline-widget");
  if (!widget) return;

  const isVisible = (el) =>
    !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  if (!isVisible(widget)) return;

  // --- Calendly prefill logic ---

  const params = new URLSearchParams(window.location.search);
  const name  = params.get("name")  || "";
  const email = params.get("email") || "";

  const originalUrl = widget.getAttribute("data-url");
  if (!originalUrl) return;

  let urlObj;
  try {
    urlObj = new URL(originalUrl);
  } catch {
    return;
  }

  // Extract just the base Calendly URL (strip existing query params)
  const baseUrl = `${urlObj.origin}${urlObj.pathname}`;

  const parts = [];
  if (name)  parts.push(`name=${encodeURIComponent(name)}`);
  if (email) parts.push(`email=${encodeURIComponent(email)}`);

  const queryString = parts.join("&");

  const calendlyUrl = queryString
    ? `${baseUrl}?${queryString}`
    : baseUrl;

  widget.setAttribute("data-url", calendlyUrl);

  const tryInit = () => {
    if (window.Calendly && typeof Calendly.initInlineWidgets === "function") {
      Calendly.initInlineWidgets();
    } else {
      setTimeout(tryInit, 80);
    }
  };

  tryInit();
}

////////////// Public API //////////////

export function selfScheduleUS() {
  setupSelfSchedule();
  setupCalendlyPrefill();
}
