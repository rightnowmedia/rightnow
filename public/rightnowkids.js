import { setupGlobal } from './components/global.js';
import { setupPopups } from './components/popups.js';
import { setupForms } from './components/forms.js';

console.log('rightnowpastors loaded');

setupGlobal();
setupPopups();
setupForms();


//////////// Success Pages ////////////

const path = window.location.pathname;

// run only on specific success URLs
const SUCCESS_ROUTES = {
  '/success/plus-us-calendly': selfSchedulePPlusUSSuccess
};

const run = SUCCESS_ROUTES[path];
if (run) run();
