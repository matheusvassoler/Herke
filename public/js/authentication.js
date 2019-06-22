var email = document.getElementById('email');
var password = document.getElementById('password');

var authFacebookButton = document.getElementById('authFacebookButton');
var authGoogleButton = document.getElementById('authGoogleButton');

var displayName = document.getElementById('displayName');

var loginButton = document.getElementById('loginButton');

var alertHeader = document.getElementById("alert-header");
var passwordMessage = document.getElementById("password-message");

loginButton.addEventListener('click', function() {
    firebase
        .auth()
        .signInWithEmailAndPassword(email.value, password.value)
        .then(function (result) {
            //Get the user
            var user = result.user;

            //Get uid of the user
            var uid = user.uid;

            getAccessLevel(uid).then(function (result) {
                if(result == 1) {
                    window.location.replace("../dashboard.html");
                } else {
                    window.location.replace("../rent.html");
                }
            });
            //window.location.replace("http://www.w3schools.com");
        })
        .catch(function (error) {
            console.error(error.code);
            console.error(error.message);
            alert('Falha ao autenticar')
        })
});

function getAccessLevel(userId) {
    return new Promise(function (resolve, reject) {
        try {
            var ref = firebase.database().ref("users/" + userId);

            var accessLevel;
            console.log(userId);
            ref.on("value", function(snapshot) {
                var data = snapshot.val()
        
                accessLevel = data.level;

                console.log(data);
                console.log(userId);
                resolve(accessLevel);
            });
        } catch (e) {
            console.log(e);
            reject(e);
        }
    });
}

//Logout
function log() {
    firebase
        .auth()
        .signOut()
        .then(function() {
            window.location.replace("../login.html");
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
        //Get uid of the user
        var uid = user.uid;
        console.log(uid);

        getAccessLevel(uid).then(function (result) {
            if(result == 1) {
                window.location.replace("../dashboard.html");
            } else {
                window.location.replace("../rent.html");
            }
        });
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