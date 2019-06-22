var btnLogout = document.getElementById('logout-button');

var liAdminMode = document.getElementById('li-admin-mode');

var liUserMode = document.getElementById('li-user-mode');

btnLogout.addEventListener('click', function() {
    log();
})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getAccessLevel(user.uid).then(function(result) {
            if(result == 1) {
                liAdminMode.style.display = "inline";
                liUserMode.style.display = "inline";
            } else {
                liAdminMode.style.display = "none";
                liUserMode.style.display = "none";
            }
        });
    } else {
        window.location.replace("../login.html");
    }
});