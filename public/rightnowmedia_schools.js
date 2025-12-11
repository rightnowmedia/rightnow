import { setupGlobal } from './components/global.js';
import { setupPopups } from './components/popups.js';
import { setupForms } from './components/forms.js';
import { selfScheduleUS } from './components/selfschedule_v2_schools.js';

console.log('rightnowmedia schools loaded');

setupGlobal();
setupPopups();
setupForms();
selfScheduleUS();