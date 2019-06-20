var parId;

window.onload = function() {
    loadMarker();
    loadScooter();

    var pushedRef = firebase.database().ref('/parking').push();
    console.log(pushedRef.key); 
}

function loadMarker() {
    var layerGroup = L.layerGroup().addTo(mymap);
    layerGroup.clearLayers();
    
    var ref = firebase.database().ref("parking");

    ref.on("value", function(snapshot) {
        var keys = Object.keys(snapshot.val());
        var count = 0;
        snapshot.forEach(function(childSnapshot) {
        var key = keys[count]
        var childData = childSnapshot.val();
        console.log(Object.keys(childData));
        var lat = childData.lat;
        var lng = childData.lng;

        //Add marker and remove shadow of it
        var icon = new L.Icon.Default();
        icon.options.shadowSize = [0,0];
        console.log(lat);
        console.log(lng);
        var mapa = L.marker([lat, lng], {mapId: key}).on('click', onClick).addTo(mymap);
        mapa._icon.id = key;

        //console.log(childData);
        count += 1;
        });
    });

    ref.on('value', getKey);
}

function onClick(e) {
    //alert(this.getLatLng());
    alert("You clicked on marker with customId: " +this.options.mapId);
    parId = this.options.mapId;

    spanModal.style.display = "none";
    modalTitle.innerHTML = "Cadastro de patinetes";
    modal.style.display = "block";
    btnRegisterScooter.style.display = "block";
    btnDeleteParking.style.display = "block";
    submitButton.style.display = "none";

    //registerScooter(parkingId);
}

function getKey(data) {
    var parkingId = data.val()
    var keys = Object.keys(parkingId)
    
    
}

function loadScooter() {
    let scooter = L.icon({
        iconUrl: '..images/scooter.png',
        shadowUrl: '..images/scooter.png',
        iconSize:     [20, 16], // size of the icon
        shadowSize:   [0, 0] // size of the shadow 
    });

    var ref = firebase.database().ref("scooter");

    var parkingIdList = Array();

    /*ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        var lat = childData.lat;
        var lng = childData.lng;

        parkingIdList.push(childData.parkingId);

        //Add marker and remove shadow of it
        //L.marker([lat, lng], {icon: scooter}).addTo(mymap);
        });
    });*/

    ref.on('value', gotData, errData);

    ref = firebase.database().ref("/parking/" + parkingIdList[0]);
    /*console.log(parkingIdList[0])
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        var lat = childData.lat;
        var lng = childData.lng;

        //Add marker and remove shadow of it
        //L.marker([lat, lng], {icon: scooter}).addTo(mymap);
        });
    });*/

    //console.log(parkingIdList);  
}

function gotData(data) {
    var parkingId = data.val()
    var keys = Object.keys(parkingId)

    var a = [];

    for(var i=0; i < keys.length; i++) {
        var k = keys[i];

        var parkId = parkingId[k].parkingId;

        a.push(parkId);
        console.log(parkId);
    }

    var unique = a.filter( onlyUnique )
    console.log(a);

    //var listNumberScooter = getNumberScotter(a);
    //console.log(listNumberScooter);
    
    var listLatLng = [];
    for(var i=0; i<a.length; i++) {
        ref = firebase.database().ref("/parking/" + a[i]);
        var latlng = []
        ref.on("value", function(snapshot) {
            //alert(a[0]);
            snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var lat = childData.lat;
            var lng = childData.lng;
            latlng.push(childData);
    
            //Add marker and remove shadow of it
            //L.marker([lat, lng], {icon: scooter}).addTo(mymap);
            });
        });  
        listLatLng.push(latlng);     
    }

    console.log(listLatLng);

    let scooter = L.icon({
        iconUrl: 'images/66527.svg',
        shadowUrl: 'images/66527.svg',
        iconSize:     [28, 24], // size of the icon
        shadowSize:   [0, 0] // size of the shadow 
    });

    for(var i=0; i<listLatLng.length; i++) {
        L.marker([listLatLng[i][0], listLatLng[i][1]], {icon: scooter}).addTo(mymap);
    }
    //L.marker([lat, lng], {icon: scooter}).addTo(mymap);
}

function errData(err) {
    console.log('Error');
    console.log(err);
}

function getNumberScotter(array) {
    var current = null;
    var cnt = 0;
    var listNumberElements = []
    for (var i = 0; i < array.length; i++) {
        var numberElements = [];
        if (array[i] != current) {
            if (cnt > 0) {
                console.log(current + ' comes --> ' + cnt + ' times<br>');
                numberElements.push([current, cnt]);
            }
            current = array[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }
    if (cnt > 0) {
        console.log(current + ' comes --> ' + cnt + ' times');
        numberElements[i] = [current, cnt]
    }

    listNumberElements.push(numberElements);

    return listNumberElements;
}

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

//Load map
var mymap = L.map('mapid').setView([ -22.8723, -47.044], 15);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYWxib3JkaWdub24iLCJhIjoiY2l0MzFlZXdzMHRyNjJvcGdnY2txZXdsMCJ9.IOAXYE1_mrHHHUbVMxR59Q', {
    maxZoom: 20,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

function deleteParking(parkingId) {
    firebase.database().ref('parking/' + parkingId).remove();
    
    var ref = firebase.database().ref("scooter");

    ref.on("value", function(snapshot) {
        var keys = Object.keys(snapshot.val());
        var count = 0;

        snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();

        var parkId = childData.parkingId;

        var key = keys[count];
        
        if(parkId == parkingId) {
            firebase.database().ref('scooter/' + key).remove();
        }

        count += 1;
        });
    });
}