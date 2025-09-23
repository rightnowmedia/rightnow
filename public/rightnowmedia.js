import { setupForms, selfSchedule } from './components/demoforms.js';
import { successAllPages, successUSCalendly } from './pages/success.js';


console.log('rightnowmedia loaded');


//////////// setupForms ////////////

setupForms([
  'demoForm_US',
  'demoForm_US_ReturningVisitor',
  'demoForm_US_Popup'
]);



//////////// selfSchedule ////////////

selfSchedule([
  'demoForm_US', 
  'demoForm_US_ReturningVisitor'
]);



//////////// Success Pages ////////////

const path = window.location.pathname;

// run on ALL success pages
if (path.startsWith('/us/success') || path.startsWith('/success/')) {
  successAllPages();
}

// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/success/us-calendly': successUSCalendly
};

const run = SUCCESS_ROUTES[path];
if (run) run();