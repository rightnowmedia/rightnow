import { setupForms } from './components/forms.js';
import { selfScheduleUS, selfScheduleUSSuccess } from './components/selfschedule.js';
import { successAllPages } from './pages/success.js';


console.log('rightnowmedia loaded');


//////////// setupForms ////////////

setupForms([
  'demoForm_US',
  'demoForm_US_ReturningVisitor',
  'demoForm_US_Popup',
  'demoForm_US_AdLandingPage',
]);


//////////// selfSchedule ////////////

selfScheduleUS([
  'demoForm_US',
  'demoForm_US_ReturningVisitor',
]);


//////////// Success Pages ////////////

const path = window.location.pathname;

// run on ALL success pages
if (path.startsWith('/us/success') || path.startsWith('/success/')) {
  successAllPages();
}