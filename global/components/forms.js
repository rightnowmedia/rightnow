
export function setupForms(ids) {

  console.log("Forms Component Active");

  if (Array.isArray(ids) && ids.length) {
    const found = ids.some(id => document.getElementById(id));
    if (!found) return;
  }

  const forms = Array.from(document.querySelectorAll('form'));
  if (!forms.length) return;


  //////////// STATE FIELD BEHAVIOR ////////////

  document.querySelectorAll("form").forEach((form) => {
    const stateSelect = form.querySelector(
      'select[name="State"], select[name="state"]'
    );
    if (!stateSelect) return;

    stateSelect.required = true;

    stateSelect.addEventListener("change", () => {
      stateSelect.required = false;
      const countryField = form.querySelector(
        '[name="Country"], [name="country"]'
      );
      if (countryField && countryField.type === "hidden") {
        countryField.value = stateSelect.value ? "United States" : "";
      }
    });
  });


  //////////// GET UTM PARAMS FROM URL ////////////

  const params = new URLSearchParams(window.location.search);

  const utmSourceFromUrl =
    (params.get('utm_source') || '').toLowerCase();

  const utmCampaignFromUrl =
    (params.get('utm_campaign') || '').toLowerCase();

  const emailSourceFromUrl =
    (params.get('email_source') || '').toLowerCase();


  const TTL = 1000 * 60 * 60 * 24 * 7;
  const LOW_PRIORITY = ['email', 'blog'];


  // -------- SOURCE STORAGE --------

  let storedSource = null;
  try {
    const raw = localStorage.getItem('utm_source');
    if (raw) storedSource = JSON.parse(raw);
  } catch (e) {}

  if (storedSource?.expires < Date.now()) {
    storedSource = null;
  }

  const storedSourceValue =
    storedSource?.value?.toLowerCase() || '';

  const effectiveSource =
    utmSourceFromUrl || storedSourceValue;

  if (utmSourceFromUrl) {
    const isNewLow = LOW_PRIORITY.includes(utmSourceFromUrl);
    const isStoredHigh =
      storedSourceValue &&
      !LOW_PRIORITY.includes(storedSourceValue);

    if (!isNewLow || !isStoredHigh) {
      try {
        localStorage.setItem(
          'utm_source',
          JSON.stringify({
            value: utmSourceFromUrl,
            expires: Date.now() + TTL,
          })
        );
      } catch (e) {}
    }
  }


  // -------- CAMPAIGN STORAGE --------

  let storedCampaign = null;
  try {
    const raw = localStorage.getItem('utm_campaign');
    if (raw) storedCampaign = JSON.parse(raw);
  } catch (e) {}

  if (storedCampaign?.expires < Date.now()) {
    storedCampaign = null;
  }

  const storedCampaignValue =
    storedCampaign?.value?.toLowerCase() || '';

  const effectiveCampaign =
    utmCampaignFromUrl || storedCampaignValue;

  if (utmCampaignFromUrl) {
    try {
      localStorage.setItem(
        'utm_campaign',
        JSON.stringify({
          value: utmCampaignFromUrl,
          expires: Date.now() + TTL,
        })
      );
    } catch (e) {}
  }


  // -------- EMAIL SOURCE STORAGE --------

  let storedEmailSource = null;
  try {
    const raw = localStorage.getItem('email_source');
    if (raw) storedEmailSource = JSON.parse(raw);
  } catch (e) {}

  if (storedEmailSource?.expires < Date.now()) {
    storedEmailSource = null;
  }

  const storedEmailSourceValue =
    storedEmailSource?.value?.toLowerCase() || '';

  const effectiveEmailSource =
    emailSourceFromUrl || storedEmailSourceValue;

  if (emailSourceFromUrl) {
    try {
      localStorage.setItem(
        'email_source',
        JSON.stringify({
          value: emailSourceFromUrl,
          expires: Date.now() + TTL,
        })
      );
    } catch (e) {}
  }


  // -------- SOURCE MAP --------

  const SOURCE_MAP = {
    google: 'Online Advertising: Google',
    facebook: 'Online Advertising: Facebook',
    bing: 'Online Advertising: Bing',
    stackadapt: 'Online Advertising: StackAdapt',
    email: 'Received an Email from RightNow Media',
    blog: 'Blog',
    inclub: 'inclub',
    gloo: 'Gloo Advertising',
    reddit: 'Online Advertising: Reddit',
    outreachmagazine: 'Print Advertising',
    rightnowmedia: 'Cross-Site: RightNow Media',
    rightnowmediaatwork: 'Cross-Site: RightNow Media At Work',
    rightnowmediaschools: 'Cross-Site: RightNow Media Schools',
    rightnowpastors: 'Cross-Site: RightNow Pastors',
    rightnowpastorsplus: 'Cross-Site: RightNow Pastors+',
    rightnowkids: 'Cross-Site: RightNow Kids',
    christianitytoday: 'Online Advertising: Christianity Today',
    outreachmediagroup: 'Online Advertising: Outreach',
    churchexecutive: 'Online Advertising: Church Exec',
  };


  // -------- CAMPAIGN MAP --------

  const CAMPAIGN_MAP = {
    built_for_this_lp: 'Built For This LP',
    bft2026: 'Built For This LP',
  };


  // -------- RESOLVE VALUES --------

  const sourceName =
    SOURCE_MAP[effectiveSource] || '';

  const campaignName =
    CAMPAIGN_MAP[effectiveCampaign] || '';

  const sourceValue =
    effectiveSource || '';


  // -------- EXPOSE GLOBALLY --------

  window.adSourceName = sourceName;
  window.campaignName = campaignName;
  window.sourceValue = sourceValue;
  window.emailSource = effectiveEmailSource;


  // -------- POPULATE FORM FIELDS --------

  if (sourceName) {
    document.querySelectorAll(
      '#Ad-Source, [name="00N6A00000NUjJQ"]'
    ).forEach(field => {
      field.value = sourceName;
    });
  }

  if (campaignName) {
    document.querySelectorAll('#utm_campaign')
      .forEach(field => {
        field.value = campaignName;
      });
  }

  if (sourceValue) {
    document.querySelectorAll('#utm_source')
      .forEach(field => {
        field.value = sourceValue;
      });
  }

  if (effectiveEmailSource) {
    document.querySelectorAll(
      '#email_source, [name="00NUo000005etZB"]'
    ).forEach(field => {
      field.value = effectiveEmailSource;
    });
  }


  // -------- STANDARD URL PARAM -> FORM FIELD MAP --------

  const FIELD_MAP = {

    first_name: '#first_name, [name="first_name"], [name="First-Name"]',
    last_name: '#last_name, [name="last_name"], [name="Last-Name"]',
    email: '#email, [name="email"], [name="Email"]',
    phone: '#phone, [name="phone"], [name="Phone"]',
    company: '#company, [name="company"], [name="Company"]',
    org_size: '#employees, [name="employees"], [name="Organization-Size"]',
    city: '#city, [name="city"], [name="City"]',
    state: '#state, [name="state"], [name="State"]',
    job_title: '#title, [name="title"], [name="Job-Title"]',

  };

  forms.forEach((form) => {
    Object.entries(FIELD_MAP).forEach(([param, selector]) => {
      const value = params.get(param);
      if (!value) return;

      form.querySelectorAll(selector).forEach(field => {
        field.value = value;

        // Needed for fields with dependent logic, especially State -> Country
        field.dispatchEvent(new Event('change', { bubbles: true }));
        field.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
  });
  
  ////////////// WEBTOLEAD RECAPTCHA SETUP ////////////

  function registerCaptchaCallback(fn) {
    window.CaptchaCallbacks = window.CaptchaCallbacks || [];

    // If the API is already loaded, run immediately
    if (window.CaptchaReady && window.grecaptcha && typeof grecaptcha.render === 'function') {
      fn();
    } else {
      // Otherwise, queue it for CaptchaInit()
      window.CaptchaCallbacks.push(fn);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form').forEach((form, index) => {
      const recaptchaEl = form.querySelector('.recaptcha-webtolead');
      if (!recaptchaEl) return;

      const submitBtn = form.querySelector('[type="submit"]');
      if (!submitBtn) return;

      if (!recaptchaEl.id) {
        recaptchaEl.id = `recaptcha_${index}`;
      }

      let widgetId = null;

      registerCaptchaCallback(function () {
        widgetId = grecaptcha.render(recaptchaEl.id, {
          sitekey: window.SITE_KEY,
          callback: update,
          'expired-callback': update,
          'error-callback': update,
        });
      });

      function valid() {
        return form.checkValidity();
      }

      function solved() {
        // guard for widgetId not being ready yet
        return widgetId !== null && grecaptcha.getResponse(widgetId).length > 0;
      }

      function update() {
        const disable = valid() ? !solved() : false;
        const opacity = disable ? '0.6' : '1';

        submitBtn.disabled = disable;
        submitBtn.style.opacity = opacity;

        const btnParent = submitBtn.closest('.btn');
        if (btnParent) btnParent.style.opacity = opacity;
      }

      form.addEventListener('input', update);
      form.addEventListener('change', update);
      form.addEventListener('submit', (e) => {
        if (valid() && !solved()) {
          e.preventDefault();
          submitBtn.disabled = true;
        }
      });

      update();
    });
  });


  //////////// WEBTOLEAD RECAPTCHA SALESFORCE TIMESTAMP ////////////

  function timestamp() {
    var settings = document.getElementsByName("captcha_settings");
    if (!settings.length) return;

    for (var i = 0; i < settings.length; i++) {
      var responseId = (i === 0)
        ? "g-recaptcha-response"
        : "g-recaptcha-response-" + i;

      var response = document.getElementById(responseId);

      if (response == null || response.value.trim() === "") {
        var elems = JSON.parse(settings[i].value);
        elems["ts"] = JSON.stringify(new Date().getTime());
        settings[i].value = JSON.stringify(elems);
      }
    }
  }
  setInterval(timestamp, 500);

}