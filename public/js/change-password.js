var txtPassword = document.getElementById("password");
var alertHeader = document.getElementById("alert-header");
var passwordMessage = document.getElementById("password-message");

alertHeader.style.display = "none";

var btnChangePassword = document.getElementById("changePassword");

btnChangePassword.addEventListener("click", function() {
    changePassword(txtPassword.value);
});

function changePassword(password) {
    var user = firebase.auth().currentUser
    
    user.updatePassword(password).then(function() {
        passwordMessage.innerHTML = "Senha alterada com sucesso! Redirecionando você para a pagina de login";
        alertHeader.style.display = "flex";
        log();
        setTimeout( function() {
            window.location.replace("../login.html");
        }, 5000 );
      }).catch(function(error) {
        passwordMessage.innerHTML = "Falha ao trocar a senha";
        alertHeader.style.backgroundColor = "#a43a2b";
        alertHeader.style.display = "flex";
        console.log(error);
      });
}

//Logout
function log() {
    firebase
        .auth()
        .signOut()
        .then(function() {

        })
        .catch(function (error) {

        });
}

