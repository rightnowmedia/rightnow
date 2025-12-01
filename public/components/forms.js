
export function setupForms(ids) {

  console.log("Forms Component Active");

  // If specific IDs were provided, honor that first
  if (Array.isArray(ids) && ids.length) {
    const found = ids.some(id => document.getElementById(id));
    if (!found) return;
  }

  // Stop if no forms at all
  const forms = Array.from(document.querySelectorAll('form'));
  if (!forms.length) return;

  
  //////////// SELECT FIELD BEHAVIOR ////////////

  document.querySelectorAll("select").forEach((select) => {
    const update = () => {
      const empty = select.value === "";
        select.style.color = empty ? "#777" : "#222";
        select.style.fontWeight = empty ? "300" : "400";
    };
    update();

    select.addEventListener("change", () => {
      update();

      if (select.name && (select.name === "State" || select.name === "state")) {
        const form = select.closest("form");
        const countryField = form?.querySelector('[name="Country"], [name="country"]');
        if (countryField && countryField.type === "hidden") {
          countryField.value = select.value ? "United States" : "";
        }
      }
    });
  });


  //////////// COUNTRY VISIBLE - SELECT FIELD BEHAVIOR ////////////

  document.querySelectorAll('form #Country:not([type="hidden"])').forEach((country) => {
    const form = country.closest("form");
    if (!form) return;

    const state = form.querySelector("#State");
    if (!state) return;

    // Change handler
    country.addEventListener("change", () => {
      if (country.value === "United States") {
        state.style.pointerEvents = "auto";
        state.style.color = "#222";
        state.required = true;
      } else {
        state.style.pointerEvents = "none";
        state.style.color = "#aaa";
        state.required = false;
        state.selectedIndex = 0;
      }
    });

    // Initial styles for country
    country.style.color = "#777";
    country.style.fontWeight = "300";

    country.addEventListener("focus", () => {
      country.style.color = "#222";
      country.style.fontWeight = "400";
    });
  });


  //////////// GET UTM SOURCE FROM URL ////////////

  const params = new URLSearchParams(window.location.search);
  const utmSourceFromUrl = (params.get('utm_source') || '').toLowerCase();

  const TTL = 1000 * 60 * 60 * 24 * 7;
  const LOW_PRIORITY = ['email', 'blog'];

  // Read stored record (new format only: { value, expires })
  let stored = null;
  try {
    const raw = localStorage.getItem('utm_source');
    if (raw) {
      stored = JSON.parse(raw);
    }
  } catch (e) {
    stored = null;
  }

  if (stored && stored.expires && stored.expires < Date.now()) {
    stored = null;
  }

  const storedValue = stored && stored.value ? stored.value.toLowerCase() : '';

  // URL UTM wins if present, otherwise fall back to stored
  const effectiveSource = utmSourceFromUrl || storedValue;

  // Save UTM to localStorage, but low-priority UTM will not overwrite
  if (utmSourceFromUrl) {
    const isNewLow = LOW_PRIORITY.includes(utmSourceFromUrl);
    const isStoredHigh = storedValue && !LOW_PRIORITY.includes(storedValue);

    if (!isNewLow || !isStoredHigh) {
      try {
        localStorage.setItem(
          'utm_source',
          JSON.stringify({
            value: utmSourceFromUrl,
            expires: Date.now() + TTL,
          })
        );
      } catch (e) { }
    }
  }

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
  };

  const sourceName = SOURCE_MAP[effectiveSource] || '';

  if (sourceName) {
    document.querySelectorAll('#Ad-Source, [name="00N6A00000NUjJQ"]').forEach((field) => {
      field.value = sourceName;
    });
  }

  
  //////////// RECAPTCHA WEBTOLEAD SETUP ////////////

  document.querySelectorAll('form').forEach((form, index) => {
    const recaptchaEl = form.querySelector('.recaptcha-webtolead');
    if (!recaptchaEl) return;

    const submitBtn = form.querySelector('[type="submit"]');
    if (!submitBtn) return;

    if (!recaptchaEl.id) {
      recaptchaEl.id = `recaptcha_${index}`;
    }

    let widgetId = null;
    window.CaptchaCallbacks.push(function() {
      widgetId = grecaptcha.render(recaptchaEl.id, {
        sitekey: window.SITE_KEY,
        callback: update,
        'expired-callback': update,
        'error-callback': update 
      });
    });

    function valid() {
      return form.checkValidity();
    }

    function solved() {
      return grecaptcha.getResponse(widgetId).length > 0;
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


  //////////// RECAPTCHA WEBTOLEAD SALESFORCE TIMESTAMP ////////////

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