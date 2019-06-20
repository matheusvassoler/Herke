//Variable to identify if user selected two coordinates to get the distance
var corCount = 0;

var latLng = [];

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
        var mapa = L.marker([lat, lng], {mapId: key}).addTo(mymap);
        mapa._icon.id = key;

        //console.log(childData);
        count += 1;
        });
    });

    ref.on('value', getKey);
}

function onClick(e) {
    //alert(this.getLatLng());
    alert("You clicked on marker with customId: " +this.options.icon.options.id);
    console.log(this.options.icon.options.id);

    var parkingId = getParkingId(this.options.icon.options.id);

    latLng = getParkingCoord(parkingId);
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

    for(var i=0; i<listLatLng.length; i++) {
        let scooter = L.icon({
            iconUrl: 'images/66527.svg',
            shadowUrl: 'images/66527.svg',
            iconSize:     [28, 24], // size of the icon
            shadowSize:   [0, 0], // size of the shadow 
            id: keys[i]
        });

        L.marker([listLatLng[i][0], listLatLng[i][1]], {icon: scooter}).on('click', onClick).addTo(mymap);
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

function getDistance(origin, destination) {
    // return distance in meters
    var lon1 = toRadian(origin[1]),
        lat1 = toRadian(origin[0]),
        lon2 = toRadian(destination[1]),
        lat2 = toRadian(destination[0]);

    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
}

function toRadian(degree) {
    return degree*Math.PI/180;
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

//Open modal when user clicks on somewhare of the map
mymap.on('click', function(e) {
    //alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    //modal.style.display = "block";
    alert(e.latlng.lat + " " + e.latlng.lng);

    if(corCount == 1) {
        corCount = 0;
    }

    distance = getDistance(latLng, [e.latlng.lat, e.latlng.lng]).toFixed(1);
});

function getParkingId(scooterId) {

    var ref = firebase.database().ref("/scooter/"+scooterId);

    var idParking;

    ref.on("value", function(snapshot) {
        var data = snapshot.val()
        idParking = data.parkingId;
    });

    return idParking;
}

function getParkingCoord(parkingId) {
    var ref = firebase.database().ref("/parking/"+parkingId);

    var latLng = [];

    ref.on("value", function(snapshot) {
        var data = snapshot.val();
        latLng.push(data.lat);
        latLng.push(data.lng);
    });

    return latLng;
}