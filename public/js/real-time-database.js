//Get data from inputs
var namee = document.getElementById('nameUser');
var lastName = document.getElementById('lastName');
var email = document.getElementById('email');
var password = document.getElementById('password');
var registerButton = document.getElementById('registerButton');

var authFacebookButton = document.getElementById('authFacebookButton');
var authGoogleButton = document.getElementById('authGoogleButton');

//Function when user click on register button
registerButton.addEventListener('click', function() {
    //createe();
    create(namee.value, lastName.value, email.value, password.value);
    setTimeout( function() {
        window.location.replace("../rent.html");
    }, 2000 );
});

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

        writeUserData(uid, "Teste", "Teste", 0);

        setTimeout( function() {
            getAccessLevel(uid).then(function (result) {
                if(result == 1) {
                    window.location.replace("../dashboard.html");
                } else {
                    window.location.replace("../rent.html");
                }
            });
        }, 3000);

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

function getAccessLevel(userId) {
    return new Promise(function (resolve, reject) {
        try {
            var ref = firebase.database().ref("users/" + userId);

            var accessLevel;
        
            ref.on("value", function(snapshot) {
                var data = snapshot.val()
        
                accessLevel = data.level;

                resolve(accessLevel);
            });
        } catch (e) {
            reject(e);
        }
    });
}


function createe() {
    var data = {
        //name: name,
        lastName: "Oi",
        email: "Oi",
        password: "Oi"
    };

    //Acessa o banco de dados firebase com base na referencia de um filho, que no caso se chama users
    //Se a colecao nao existir, ela serah criada
    return firebase.database().ref().child('clients').push(data);
}

function create(name, lastName, email, password) {
    createe(name, lastName, email, password);
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
        })
        .then(function(result) {
            var user = result.user;
            var userId = user.uid;
            writeUserData(userId, name, lastName, 0);

            //window.location.replace("../public/rent.html");
        });
}

function writeUserData(userId, name, lastName, level) {
    firebase.database().ref('users/' + userId).set({
      name: name,
      lastName: lastName,
      level: level
      //some more user data
    });
  }





