var txtEmail = document.getElementById("email");
var alertHeader = document.getElementById("alert-header");
var passwordMessage = document.getElementById("password-message");

alertHeader.style.display = "none";

var btnChangePassword = document.getElementById("changePassword");

btnChangePassword.addEventListener("click", function() {
    changePassword(txtEmail.value);
});

function changePassword(email) {
    var auth = firebase.auth();

    auth.sendPasswordResetEmail(email).then(function() {
        passwordMessage.innerHTML = "E-mail enviado com sucesso! Redirecionando você para a pagina de login";
        alertHeader.style.backgroundColor = "#77a42b";
        alertHeader.style.display = "flex";
        setTimeout( function() {
            window.location.replace("../login.html");
        }, 5000 );
    }).catch(function(error) {
        passwordMessage.innerHTML = "Falha ao enviar o e-mail";
        alertHeader.style.backgroundColor = "#a43a2b";
        alertHeader.style.display = "flex";
    });
}