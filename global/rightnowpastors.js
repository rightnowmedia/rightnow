import { setupGlobal } from './components/global.js';
import { setupPopups } from './components/popups.js';
import { setupForms } from './components/forms.js';
import { selfScheduleUS } from './components/selfschedule_v2.js';

console.log('rightnowpastors loaded');

setupGlobal();
setupPopups();
setupForms();
selfScheduleUS();