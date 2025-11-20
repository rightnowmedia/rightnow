import { setupGlobal } from './components/global.js';
import { setupForms } from './components/forms.js';


console.log('rightnowmediaatwork loaded');

setupGlobal();

setupForms([
  'demoForm_RNMW_US',
  'demoForm_RNMW_US_Home',
  'demoForm_RNMW_US_Popup',
  'demoForm_RNMW_US_Pricing'
]);