////////////// Self-Schedule //////////////

// Form Requirements:
// *Must be Web-to-Lead
// *Needs .selfschedule-configuration class
// *Needs Title field
// *Needs Organization Size field


// Site-specific Org Size range configuration
const RANGE_CONFIG = {
  // Default
  default: [
    { min: 1,      max: 750,      bucket: 'one'   },
    { min: 751,    max: 10000,    bucket: 'two'   },
    { min: 10001,  max: Infinity, bucket: 'three' },
  ],

  // demoForm_US* 
  us: [
    { min: 1,      max: 750,      bucket: 'one'   },
    { min: 751,    max: Infinity,    bucket: 'two'   },
  ],

  // demoForm_RNMW*
  rnwm: [
    { min: 1,   max: 5,       bucket: 'one'   },
    { min: 6,   max: 99,      bucket: 'two'   },
    { min: 100, max: Infinity, bucket: 'three' },
  ],
};

function getBucketFromRanges(index, rules) {
  if (!Number.isFinite(index) || index <= 0) return 'default';
  for (const r of rules) {
    if (index >= r.min && index <= r.max) return r.bucket;
  }
  return 'default';
}

// Decide which site's rules to use based on form ID
function getSiteKey(form) {
  const id = form.id || '';
  if (id.startsWith('demoForm_US')) return 'us';
  if (id.startsWith('demoForm_RNMW')) return 'rnwm';
  if (id.startsWith('demoForm_PastorsPlus')) return 'pastorsplus';
  return 'default';
}

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
        three:   text('.selfschedule-returl-3'),
      },
    };
  };

  function updateRetUrl(form) {
    const cfgRoot = form.querySelector('.selfschedule-configuration');
    if (!cfgRoot) return;

    const config = readConfig(form);

    const jobTitle = qs(form, '#title');
    const orgSize  = qs(form, '#employees');
    const state  = qs(form, '#state');
    const subscriber = qs(form, '#00N2K00000CWQVv') || qs(form, '[name="00N2K00000CWQVv"]');

    if (!jobTitle) return;

    const jt      = jobTitle.value;
    const stateValue = state ? state.value : '';
    const isSubscriber = !!subscriber && subscriber.checked;
    const siteKey = getSiteKey(form);
    const rules   = RANGE_CONFIG[siteKey] || RANGE_CONFIG.default;

    let bucket;

    if (jt === 'Non-Staff' || jt === 'Employee' || jt === 'Ministry Leader') {
      bucket = 'default';
    } else if (state && stateValue === '') {
      bucket = 'default';
    } else {
      if (!orgSize) {
        if (isSubscriber) {
          bucket = 'two';
        } else {
          bucket = 'one';
        }
      } else {
        // Org size exists
        const value = orgSize.value.trim();
        const hasValue = value !== '';

        if (hasValue) {
          const index = Number(value);
          bucket = getBucketFromRanges(index, rules);
        } else {
          // field exists but is empty
          bucket = 'default';
        }
      }
    }

    const successBase = config.returl[bucket];
    const retUrlEl   = qs(form, '#retURL') || qs(form, '[name="retURL"]');
    if (retUrlEl && successBase)  retUrlEl.value = buildRetURL(successBase, form);
  }

  forms.forEach(updateRetUrl);

  document.addEventListener('change', (e) => {
    if (!forms.includes(e.target?.form)) return;
    if (
      e.target.id === 'employees' ||
      e.target.id === 'title' ||
      e.target.id === 'state' ||
      e.target.id === '00N2K00000CWQVv' ||
      e.target.name === '00N2K00000CWQVv'
    ) {
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