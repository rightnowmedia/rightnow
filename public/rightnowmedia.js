import { setupForms, selfSchedule } from './components/demoforms.js';


console.log('rightnowmedia loaded');


//////////// setupForms ////////////

const setupFormIds = [
  'demoForm_US',
  'demoForm_US_ReturningVisitor',
  'demoForm_US_Popup'
];

const setupTargets = setupFormIds.map(id => document.getElementById(id)).filter(Boolean);
if (setupTargets.length > 0) {
  setupForms();
}


//////////// selfSchedule ////////////

const selfScheduleIds = [
  'demoForm_US',
  'demoForm_US_ReturningVisitor'
];

const selfScheduleTargets = selfScheduleIds.map(id => document.getElementById(id)).filter(Boolean);
if (selfScheduleTargets.length > 0) {
  selfSchedule(selfScheduleIds);
}
