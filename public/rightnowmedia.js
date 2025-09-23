import { setupForms } from './components/forms.js';
import { selfScheduleUS, selfScheduleSuccessUS } from './components/selfschedule.js';
import { successAllPages } from './pages/success.js';


console.log('rightnowmedia loaded');
const path = window.location.pathname;


//////////// setupForms ////////////

setupForms([
  'demoForm_US',
  'demoForm_US_ReturningVisitor',
  'demoForm_US_Popup'
]);



//////////// selfSchedule ////////////

selfScheduleUS([
  'demoForm_US', 
  'demoForm_US_ReturningVisitor'
]);



//////////// Success Pages ////////////


// run on ALL success pages
if (path.startsWith('/us/success') || path.startsWith('/success/')) {
  successAllPages();
}

// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/success/us-calendly': selfScheduleSuccessUS
};

const run = SUCCESS_ROUTES[path];
if (run) run();