import { setupForms, selfSchedule } from './components/demoforms.js';

if (
  document.getElementById("demoForm_US") ||
  document.getElementById("demoForm_US_2") ||
  document.getElementById("demoForm_US_ReturningVisitor") ||
  document.getElementById("demoForm_US_ReturningVisitor_2")
) {
  setupForms();
  selfSchedule();
}

console.log("rightnowmedia loaded");
