////////////// Self-Schedule (Kids Only) //////////////

function setupSelfScheduleKids() {
  const forms = Array.from(document.querySelectorAll('form'))
    .filter(form => form.id?.startsWith('demoForm_Kids') &&
                    form.querySelector('.selfschedule-configuration'));

  if (!forms.length) return;

  console.log("Kids Self-Schedule Active");

  const LIVE_FIELD_IDS = ['first_name', 'last_name', 'email'];

  const qs = (root, sel) => root.querySelector(sel);
  const val = (form, sel) => (qs(form, sel)?.value || '').trim();

  const appendQuery = (base, qstring) => {
    if (!qstring) return base;
    const [beforeHash, hash = ''] = base.split('#');
    const sep = beforeHash.includes('?') ? '&' : '?';
    const out = beforeHash + `${sep}${qstring}`;
    return hash ? `${out}#${hash}` : out;
  };

  const buildRetURL = (base, form) => {
    const first = val(form, '#first_name');
    const last  = val(form, '#last_name');
    const email = val(form, '#email');
    const name  = [first, last].filter(Boolean).join(' ');
    const q = `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
    return appendQuery(base, q);
  };

  const readConfig = (form) => {
    const cfg = form.querySelector('.selfschedule-configuration');
    const text = sel => (qs(cfg, sel)?.textContent || '').trim() || null;

    return {
      default: text('.selfschedule-returl-default'),
      one:     text('.selfschedule-returl-1'),
      two:     text('.selfschedule-returl-2'),
    };
  };

  function updateRetUrl(form) {
    const cfg = readConfig(form);

    const title = qs(form, '#title')?.value || '';
    const state = qs(form, '#state')?.value || '';

    let bucket = 'default';

    // --- State override ---
    if (state === 'Not in the U.S.') {
      bucket = 'default';
    } else {
      // --- Title-based routing ---
      switch (title) {
        case 'Non-Staff':
        case 'Kids Ministry Volunteer':
          bucket = 'default';
          break;

        case 'Pastoral Staff':
        case 'Kids Ministry Leader':
          bucket = 'one';
          break;

        case 'School/Preschool Administrator':
          bucket = 'two';
          break;

        default:
          bucket = 'default';
      }
    }

    const successBase = cfg[bucket];
    const retUrlEl =
      qs(form, '#retURL') || qs(form, '[name="retURL"]');

    if (retUrlEl && successBase) {
      retUrlEl.value = buildRetURL(successBase, form);
    }
  }

  forms.forEach(updateRetUrl);

  document.addEventListener('change', (e) => {
    if (!forms.includes(e.target?.form)) return;

    if (
      e.target.id === 'title' ||
      e.target.id === 'state'
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

////////////// Public API //////////////

export function selfScheduleKids() {
  setupSelfScheduleKids();
}
