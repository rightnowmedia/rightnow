//////////// OPEN AND CLOSE BEHAVIOR ////////////

export function setupPopups() {

  console.log("Popups Component Active");

  document.addEventListener('DOMContentLoaded', function () {
    const popupWrap = document.querySelector('.popup-wrap');
    const closeButtons = document.querySelectorAll('.popup-close');
  
    const FLAG_KEY = 'pastorsPopupWasClosed';
    const EXPIRY_KEY = 'pastorsPopupHidesUntil';
  
    function getTimeXDaysFromNow(days) {
      return Date.now() + days * 24 * 60 * 60 * 1000;
    }
  
    function hasUserExited(flagKey, expiryKey) {
      const hasExited = localStorage.getItem(flagKey);
      const expiresAt = parseInt(localStorage.getItem(expiryKey), 10);
      return hasExited && !isNaN(expiresAt) && Date.now() <= expiresAt;
    }
  
    function rememberUserExited(flagKey, expiryKey, daysToHide) {
      localStorage.setItem(flagKey, 'yes');
      localStorage.setItem(expiryKey, getTimeXDaysFromNow(daysToHide).toString());
    }
  
    if (!popupWrap) return;
  
    if (hasUserExited(FLAG_KEY, EXPIRY_KEY)) {
      popupWrap.style.display = 'none';
    }
  
    closeButtons.forEach((btn) =>
      btn.addEventListener('click', () => {
        rememberUserExited(FLAG_KEY, EXPIRY_KEY, 7);
      })
    );
  });
  
}
//////////// END ////////////
