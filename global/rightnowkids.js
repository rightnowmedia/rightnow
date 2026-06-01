import { setupGlobal } from './components/global.js';
import { setupPopups } from './components/popups.js';
import { setupForms } from './components/forms.js';
import { selfScheduleKids } from './components/selfschedule_kids.js';

console.log('rightnowkids loaded');

setupGlobal();
setupPopups();
setupForms();
selfScheduleKids();


