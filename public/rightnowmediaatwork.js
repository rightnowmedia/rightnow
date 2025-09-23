import { setupForms } from './components/forms.js';
import { selfScheduleAtWorkUS, selfScheduleSuccessAtWorkUS } from './components/selfschedule.js';
import { successAllPages } from './pages/success.js';


console.log('rightnowmediaatwork loaded');
const path = window.location.pathname;

//////////// setupForms ////////////

setupForms([
  'demoForm_RNMW_US',
  'demoForm_RNMW_US_Home',
  'demoForm_RNMW_US_Popup',
  'demoForm_RNMW_US_Pricing'
]);



//////////// selfSchedule ////////////

selfScheduleAtWorkUS([
  'demoForm_RNMW_US',
  'demoForm_RNMW_US_Home',
  'demoForm_RNMW_US_Pricing'
]);



//////////// Success Pages ////////////

// run on ALL success pages
if (path.startsWith('/atwork/us/success') || path.startsWith('/atwork/success/success/')) {
  successAllPages();
}

// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/atwork/success/us-calendly': selfScheduleSuccessAtWorkUS
};

const run = SUCCESS_ROUTES[path];
if (run) run();