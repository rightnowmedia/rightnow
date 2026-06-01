export function setupGlobal() {

  console.log("Global Component Active");

  //////////// Osano Cookie Drawer Footer Link ////////////

  document.addEventListener("DOMContentLoaded", function () {
    const cookieLink = document.getElementById("FooterLink_CookiePreferences");
    if (cookieLink) {
      cookieLink.addEventListener("click", function (e) {
        e.preventDefault();
        if (typeof Osano !== "undefined" && Osano.cm?.showDrawer) {
          Osano.cm.showDrawer('osano-cm-dom-info-dialog-open');
        } else {
          console.warn("Osano cookie manager not found.");
        }
      });
    }
  });

  const yearElement = document.getElementById("year");
  if (yearElement) { yearElement.innerHTML = new Date().getFullYear(); }

  //////////// Pardot Code ////////////

  window.piAId = '965643';
  window.piCId = '';
  window.piHostname = 'go.rightnowmedia.org';

  (function () {
    function async_load() {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://${window.piHostname}/pd.js`;
      var c = document.getElementsByTagName('script')[0];
      c.parentNode.insertBefore(s, c);
    }
    window.addEventListener('load', async_load);
  })();
  
}

