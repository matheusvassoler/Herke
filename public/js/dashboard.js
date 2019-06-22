var btnLogout = document.getElementById('logout-button');

btnLogout.addEventListener('click', function() {
    log();
})

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        getAccessLevel(user.uid).then(function(result) {
            if(result != 1) {
                window.location.replace("../404.html");
            }
        });
    } else {
        window.location.replace("../login.html");
    }
});