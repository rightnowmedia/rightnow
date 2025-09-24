

export function setupForms(ids) {

  if (Array.isArray(ids) && ids.length) {
    const found = ids.some(id => document.getElementById(id));
    if (!found) return;
  }

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

      if (select.name === "State") {
        const form = select.closest("form");
        const countryField = form?.querySelector('[name="Country"]');
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

  
  //////////// DON'T INTERRUPT THE RV FORM ////////////

  document.querySelectorAll('.top-bar-form-field').forEach(function(field) {
    field.addEventListener('focus', function() {
      document.querySelector('.popup-wrap').style.display = 'none';
    });
  });


  //////////// GET UTM SOURCE FROM URL ////////////

  const params = new URLSearchParams(window.location.search);
  const utmSource = decodeURIComponent(params.get('utm_source') || '');

  const SOURCE_MAP = {
    google: 'Online Advertising: Google',
    facebook: 'Online Advertising: Facebook',
    bing: 'Online Advertising: Bing',
    stackadapt: 'Online Advertising: StackAdapt',
    email: 'Received an Email from RightNow Media',
    blog: 'Blog',
    inclub: 'inclub',
    gloo: 'Gloo Advertising',
  };

  const sourceName = SOURCE_MAP[utmSource.toLowerCase()] || '';
  if (sourceName) {
    document.querySelectorAll('#Ad-Source, [name="Ad-Source"]').forEach((field) => {
      field.value = sourceName;
    });
  }



}

