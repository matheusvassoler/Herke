var email = document.getElementById('email');
var password = document.getElementById('password');

var authFacebookButton = document.getElementById('authFacebookButton');
var authGoogleButton = document.getElementById('authGoogleButton');

var displayName = document.getElementById('displayName');

var loginButton = document.getElementById('loginButton');

loginButton.addEventListener('click', function() {
    firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(function (result) {
            console.log(result);
            displayName.innerText = 'Bem vindo';
            alert(displayName);
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar')
        })
})

//Logout
function log(){
    firebase
        .auth()
        .signOut()
        .then(function() {

        })
        .catch(function (error) {

        });
}

//Autenticar com Google
authGoogleButton.addEventListener('click', function() {
    var provider = new firebase.auth.GoogleAuthProvider();
    signIn(provider);
});

//Autenticar com Facebook
authFacebookButton.addEventListener('click', function() {
    var provider = new firebase.auth.FacebookAuthProvider();
    signIn(provider);
});

function signIn(provider) {
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        // ...
        alert('Sucesso');
      }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorCode);
        console.log(errorMessage);
        alert('Falha')
      });
}