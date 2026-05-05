import { setupGlobal } from './components/global.js';
import { setupForms } from './components/forms.js';
import { selfScheduleUS } from './components/selfschedule_v2.js';
import { successAllPages } from './pages/success.js';

console.log('rightnowmedia loaded');

setupGlobal();
setupForms();
selfScheduleUS();


//////////// Success Pages ////////////

const path = window.location.pathname;

// run on ALL success pages
if (path.startsWith('/us/success') || path.startsWith('/success/')) {
  successAllPages();
}