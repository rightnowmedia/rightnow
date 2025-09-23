

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
        if (countryField) {
          countryField.value = select.value ? "United States" : "";
        }
      }
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



////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////



export function selfSchedule(formIds) {
  const forms = formIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!forms.length) return;

  /////// STORE FORM ANSWERS IN LOCAL STORAGE ///////
  
  const FIELD_IDS = ['First-Name','Last-Name','Email','Phone','Job-Title','Company','City','State','Country'];
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


  /////// CHANGE CAMPAIGNS BASE ON FORM SELECTIONS ///////

  const updateCampaign = (form) => {
    const orgSize = form.querySelector('#Org-Size');
    const jobTitle = form.querySelector('#Job-Title');
    if (!orgSize || !jobTitle) return;

    const heading = document.getElementById('Heading') || form.querySelector('[data-role="heading"]');
    const orgIndex = orgSize.selectedIndex;
    const jt = jobTitle.value;

    if (jt === 'Non-Staff') {
      form.action = '/default-action';
      if (heading) heading.textContent = 'Go to OVER 750 campaign';
    } else if (orgIndex <= 2) {
      form.action = '/special-action';
      if (heading) heading.textContent = 'Go to UNDER 750 campaign';
    } else {
      form.action = '/default-action';
      if (heading) heading.textContent = 'Go to OVER 750 campaign';
    }
  };

  forms.forEach(updateCampaign);
  document.addEventListener('change', (e) => {
    if ((e.target.id === 'Org-Size' || e.target.id === 'Job-Title') && forms.includes(e.target.form)) {
      updateCampaign(e.target.form);
    }
  });
}
