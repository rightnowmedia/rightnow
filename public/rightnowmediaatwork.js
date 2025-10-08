import { setupGlobal } from './components/global.js';
import { setupForms } from './components/forms.js';
import { selfScheduleAtWorkUS, selfScheduleAtWorkUSSuccess } from './components/selfschedule.js';
import { successAllPages } from './pages/success.js';


console.log('rightnowmediaatwork loaded');


setupGlobal();


setupForms([
  'demoForm_RNMW_US',
  'demoForm_RNMW_US_Home',
  'demoForm_RNMW_US_Popup',
  'demoForm_RNMW_US_Pricing'
]);


selfScheduleAtWorkUS([
  'demoForm_RNMW_US'
]);


//////////// Success Pages ////////////

const path = window.location.pathname;

// run on ALL success pages
if (path.startsWith('/atwork/us/success') || path.startsWith('/atwork/success/success/')) {
  successAllPages();
}

// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/atwork/success/us-calendly': selfScheduleAtWorkUSSuccess
};

const run = SUCCESS_ROUTES[path];
if (run) run();