//Get data from inputs
var namee = document.getElementById('nameUser');
var lastName = document.getElementById('lastName');
var email = document.getElementById('email');
var password = document.getElementById('password');
var registerButton = document.getElementById('registerButton');

//Function when user click on register button
registerButton.addEventListener('click', function() {
    alert(namee.value);
    create(namee.value, lastName.value, email.value, password.value);
});

/*
function create(name, lastName, email, password) {
    var data = {
        //name: name,
        lastName: lastName,
        email: email,
        password: password
    };

    //Acessa o banco de dados firebase com base na referencia de um filho, que no caso se chama users
    //Se a colecao nao existir, ela serah criada
    return firebase.database().ref().child('users').push(data);
}*/

function create(name, lastName, email, password) {
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





