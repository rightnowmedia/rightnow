import { setupPopups } from './components/popups.js';
import { setupForms } from './components/forms.js';
import { selfScheduleUS, selfSchedulePPlusUSSuccess } from './components/selfschedule.js';

setupPopups();
setupForms();



//////////// selfSchedule ////////////

selfScheduleUS([
  'demoForm_PastorsPlus'
]);



//////////// Success Pages ////////////


// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/success/plus-us-calendly': selfSchedulePPlusUSSuccess
};

const run = SUCCESS_ROUTES[path];
if (run) run();