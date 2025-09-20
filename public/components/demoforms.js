

export function setupForms() {

  //////////// SELECT FIELD BEHAVIOR ////////////

  document.querySelectorAll("select").forEach((select) => {
    const updateSelectColor = () => {
      const isEmpty = select.value === "";
      select.style.color = isEmpty ? "#666" : "#222";
      select.style.fontWeight = isEmpty ? "300" : "400";
    };

    // Run once on load
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

  
}



////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////



export function selfSchedule() {


  /////// STORE FORM ANSWERS IN LOCAL STORAGE ///////

  (function () {
    const STORAGE_KEY = 'leadInfo';

    function snapshot() {
      const get = (id) => {
        const el = document.getElementById(id);
        return el && typeof el.value === 'string' ? el.value.trim() : '';
      };
      return {
        firstName: get('First-Name'),
        lastName:  get('Last-Name'),
        email:     get('Email'),
        phone:     get('Phone'),
        jobTitle:  get('Job-Title'),
        company:   get('Company'),
        city:      get('City'),
        state:     get('State'),
        country:   get('Country'),
        savedAt:   Date.now()
      };
    }

    function saveToLocalStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()));
      } catch (e) {
        // storage unavailable/quota exceeded
      }
    }

    function start() {
      const forms = [
        document.getElementById('demoForm_US'),
        document.getElementById('demoForm_ReturningVisitor')
      ].filter(Boolean); 

      if (!forms.length) return;

      forms.forEach((form) => {
        form.addEventListener('input',  saveToLocalStorage, { passive: true });
        form.addEventListener('change', saveToLocalStorage, { passive: true });
      });

      window.addEventListener('beforeunload', saveToLocalStorage);
      window.addEventListener('pagehide', saveToLocalStorage);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start, { once: true });
    } else {
      start();
    }
  })();


  /////// CHANGE CAMPAIGNS BASE ON FORM SELECTIONS ///////

  const form = document.getElementById("demoForm_US");
  const orgSizeSelect = document.getElementById("Org-Size");
  const jobTitleSelect = document.getElementById("Job-Title");
  const heading = document.getElementById("Heading");

  function updateFormAction() {
    const orgIndex = orgSizeSelect.selectedIndex;
    const jobTitle = jobTitleSelect.value;

    if (jobTitle === "Non-Staff") {
      // Always force default if Job Title is Employee
      form.action = "/default-action";
      heading.innerText = "Go to OVER 750 campaign";
    } else if (orgIndex <= 2) {
      // Third option or less in Organization-Size
      form.action = "/special-action";
      heading.innerText = "Go to UNDER 750 campaign";
    } else {
      // Everything else
      form.action = "/default-action";
      heading.innerText = "Go to OVER 750 campaign";
    }
  }

  orgSizeSelect.addEventListener("change", updateFormAction);
  jobTitleSelect.addEventListener("change", updateFormAction);

  updateFormAction();


  
}

