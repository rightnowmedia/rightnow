//////////// OPEN AND CLOSE BEHAVIOR ////////////

export function setupPopups() {

  console.log("Popups worked!");

  document.addEventListener('DOMContentLoaded', function () {
    const popupBox = document.querySelector('.rightnow-media--popup-container');
    const closeButtons = document.querySelectorAll('.rightnow-media--popup-close');
  
    const FLAG_KEY = 'pastorsPopupWasClosed';
    const EXPIRY_KEY = 'pastorsPopupHidesUntil';
  
    const FADE_MS = 220;
  
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
  
    if (!popupBox) return;
  
    // Helper to cancel any in-flight animations
    function cancelAnims(el) {
      el.getAnimations?.().forEach(a => a.cancel());
    }
  
    function fadeIn(el) {
      cancelAnims(el);
      el.style.display = 'flex';       // or 'block' if you prefer
      el.style.opacity = '0';          // ensure starting point
      el.animate(
        [{ opacity: 0 }, { opacity: 1 }],
        { duration: FADE_MS, easing: 'ease', fill: 'forwards' }
      );
    }
  
    function fadeOut(el, cb) {
      cancelAnims(el);
      const anim = el.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        { duration: FADE_MS, easing: 'ease', fill: 'forwards' }
      );
      anim.onfinish = () => {
        el.style.display = 'none';
        if (cb) cb();
      };
    }
  
    setTimeout(() => {
      if (hasUserExited(FLAG_KEY, EXPIRY_KEY)) {
        popupBox.style.display = 'none';
        popupBox.style.opacity = '0';
      } else {
        fadeIn(popupBox);
      }
    }, 15000);
  
    closeButtons.forEach((btn) =>
      btn.addEventListener('click', () => {
        rememberUserExited(FLAG_KEY, EXPIRY_KEY, 7);
        fadeOut(popupBox);
      })
    );
  });
  
}
//////////// END ////////////
