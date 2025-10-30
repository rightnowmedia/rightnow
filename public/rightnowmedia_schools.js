import { setupGlobal } from './components/global.js';
import { setupPopups } from './components/popups.js';
import { setupForms } from './components/forms.js';
import { selfScheduleUS, selfScheduleSchoolsSuccess } from './components/selfschedule_schools.js';

console.log('rightnowmedia schools loaded');

setupGlobal();
setupPopups();
setupForms();



//////////// selfSchedule ////////////

selfScheduleUS([
  'demoForm_Schools'
]);




//////////// Success Pages ////////////

const path = window.location.pathname;

// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/success/us-calendly': selfScheduleSchoolsSuccess
};

const run = SUCCESS_ROUTES[path];
if (run) run();
