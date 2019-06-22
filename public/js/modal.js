//Get the submit button
var submitButton = document.getElementById("submit-button");

var btnRegisterScooter = document.getElementById('register-scooter');

var btnDeleteParking = document.getElementById('delete-parking');

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

var modalTitle = document.getElementsByClassName('modal-title')[0];

var spanModal = document.getElementsByClassName('span-address')[0];

var spanAddress = document.getElementById('address');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

/*// When the user clicks on the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}*/

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

//Open modal when user clicks on somewhare of the map
mymap.on('click', function(e) {
    //alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    modalTitle.innerHTML = "Cadastrar estacionamento e patinete";
    spanModal.style.display = "inline";
    btnRegisterScooter.style.display = "none";
    submitButton.style.display = "block";
    modal.style.display = "block";
    btnDeleteParking.style.display = "none";
    var jsonResponse = getAddressByLatLng(e.latlng.lat, e.latlng.lng)

    //Get two inputs to insert lat and lng value
    var latInput = document.getElementById("lat");
    var lngInput = document.getElementById("lng");

    //Set lat and lng value
    latInput.value = e.latlng.lat;
    lngInput.value = e.latlng.lng;

    printAddressInModal(jsonResponse)
});

function getAddressByLatLng(lat, lng) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", "https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="+lat+"&lon="+lng, false ); // false for synchronous request
    xmlHttp.send( null );
    var httpResponse = xmlHttp.responseText;
    var jsonResponse = JSON.parse(httpResponse);

    return jsonResponse;
}

function printAddressInModal(address) {
    var addressSpan = document.getElementById('address');
    
    //Get the address from JSON Response argument
    var city = address.address.city;
    var street = address.address.road;
    var district = address.address.suburb;
    var state = address.address.state;

    addressSpan.innerText = street + ", " + district + ", " + city + ", " + state;
}

function resgisterParking() {
    //Get two inputs to insert lat and lng value
    var latInput = document.getElementById("lat");
    var lngInput = document.getElementById("lng");

    var newDatabaseReference = firebase.database().ref().child("parking").push();

    var myData = {
      lat: lat.value,
      lng: lngInput.value
    }

    var newDatabaseReferenceKey = newDatabaseReference.getKey();

    newDatabaseReference.set(myData);

    registerScooter(newDatabaseReferenceKey);

    document.location.reload(true);
}

function registerScooter(parkingId) {
    var qtyScooterInput = document.getElementById('qtyScooter');

    var numberOfScooter = parseInt(qtyScooterInput.value);

    for(var i=0; i<numberOfScooter; i++) {
      var newDatabaseReference = firebase.database().ref().child("scooter").push();

      var myData = {
        parkingId: parkingId
      }
  
      newDatabaseReference.set(myData);
    }

    modal.style.display = "none";
}

submitButton.addEventListener('click', resgisterParking);

btnRegisterScooter.addEventListener('click', function() {
  //alert(parId);
  registerScooter(parId);
})

btnDeleteParking.addEventListener('click', function() {
  deleteParking(parId);
  modal.style.display = "none";
  document.location.reload(true);
})





