

//////////// SHARED ON ALL SUCCESS PAGES ////////////


export function successAllPages() {

  // Remove Hidden Stuff, ie. other regional navigations
  document.querySelectorAll(".w-condition-invisible").forEach(el => el.remove());


  // Remove Get Access and Login Buttons
  document.querySelectorAll(".navigation").forEach(nav => {
    const getAccessBtn = nav.querySelector(".header-nav-get-access");
    const loginLink = nav.querySelector("#NavLink_US_Login");

    if (getAccessBtn) getAccessBtn.remove();
    if (loginLink) loginLink.remove();
  });

}

