function loadNavigation() {
    let log = document.getElementById("nav-login");
    if (checkSession()) {
        log.href = "login.html?ref=logout";
        log.setAttribute("class","navicon fas fa-sign-out-alt");
        log.innerHTML = '&nbsp;LOGOUT'
    } else {
        log.href = "login.html?ref=login";
        log.setAttribute("class","navicon fas fa-sign-in-alt");
        log.innerHTML = '&nbsp;LOGIN'
    }
}
