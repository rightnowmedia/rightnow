

export function setupForms() {

  //////////// SELECT FIELD BEHAVIOR ////////////


  document.querySelectorAll("select").forEach((select) => {
    const updateSelectColor = () => {
      const isEmpty = select.value === "";
      select.style.color = isEmpty ? "#666" : "#222";
      select.style.fontWeight = isEmpty ? "300" : "400";
    };

    updateSelectColor();

    select.addEventListener("change", () => {
      updateSelectColor();

      if (select.name === "State") {
        const form = select.closest("form");
        const countryField = form.querySelector('[name="Country"]');
        if (countryField) {
          countryField.value = select.value === "" ? "" : "United States";
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

  const urlParam = (name) => {
    const params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  };

  const SOURCE_MAP = {
    google:     'Online Advertising: Google',
    facebook:   'Online Advertising: Facebook',
    bing:       'Online Advertising: Bing',
    stackadapt: 'Online Advertising: StackAdapt',
    email:      'Received an Email from RightNow Media',
    blog:       'Blog',
    inclub:     'inclub',
    gloo:       'Gloo Advertising'
  };

  const mapSource = (utmSource) =>
    SOURCE_MAP[utmSource.toLowerCase()] || '';

  const utmSource = decodeURIComponent(urlParam('utm_source'));
  const sourceName = mapSource(utmSource);

  // Apply to all forms on the page
  if (sourceName) {
    const targetFields = document.querySelectorAll(
      '#Ad-Source, [name="Ad-Source"]'
    );
    targetFields.forEach((field) => {
      field.value = sourceName;
    });
  }



}



////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////



export function selfSchedule(formIds) {
  // Resolve the forms once
  const forms = formIds.map(id => document.getElementById(id)).filter(Boolean);
  if (!forms.length) return;

  const formSet = new Set(forms);



  /////// STORE FORM ANSWERS IN LOCAL STORAGE ///////

  const FIELD_IDS = [
    'First-Name','Last-Name','Email','Phone',
    'Job-Title','Company','City','State','Country'
  ];

  const STORAGE_KEY = 'leadInfo';

  const get = (form, id) => {
    const el = form.querySelector(`#${id}`);
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  };

  const toCamel = (id) => id.toLowerCase().replace(/-(.)/g, (_, c) => c.toUpperCase());

  const snapshot = (form) => {
    const data = {};
    for (const id of FIELD_IDS) {
      const v = get(form, id);
      if (v !== '') data[toCamel(id)] = v;
    }
    return data;
  };

  const save = (form) => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      const patch = snapshot(form);
      const merged = { ...existing, ...patch, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch {}
  };

  const onEdit = (e) => {
    const form = e.target?.form || e.target?.closest?.('form');
    if (form && formSet.has(form)) save(form);
  };

  document.addEventListener('input', onEdit);
  document.addEventListener('change', onEdit);

  const onPageHide = () => forms.forEach(save);
  window.addEventListener('pagehide', onPageHide);




  /////// CHANGE CAMPAIGNS BASE ON FORM SELECTIONS ///////

  const updateCampaign = (form) => {
    const orgSize  = form.querySelector('#Org-Size');
    const jobTitle = form.querySelector('#Job-Title');
    if (!orgSize || !jobTitle) return;

    const heading =
      document.getElementById('Heading') || form.querySelector('[data-role="heading"]');

    const orgIndex = orgSize.selectedIndex;
    const jt = jobTitle.value;

    if (jt === 'Non-Staff') {
      form.action = '/default-action';
      if (heading) heading.innerText = 'Go to OVER 750 campaign';
    } else if (orgIndex <= 2) {
      form.action = '/special-action';
      if (heading) heading.innerText = 'Go to UNDER 750 campaign';
    } else {
      form.action = '/default-action';
      if (heading) heading.innerText = 'Go to OVER 750 campaign';
    }
  };

  forms.forEach(updateCampaign);

  const onRoutingChange = (e) => {
    const id = e.target?.id;
    if (id !== 'Org-Size' && id !== 'Job-Title') return;
    const form = e.target.form || e.target.closest?.('form');
    if (form && formSet.has(form)) updateCampaign(form);
  };

  document.addEventListener('change', onRoutingChange);

  
}

