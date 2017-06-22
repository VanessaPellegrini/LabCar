function initMap(){
  var map = new google.maps.Map(document.getElementById("map"),{
    zoom: 8,
    center: {lat: -9.1191427, lng: -77.0349046},
    mapTypeControl: false,
    zoomControl: true,
    streetViewControl: true,
  });

  function buscar(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(funcionExito, funcionError);
    }
  }

  window.addEventListener("load", buscar);

  var latitud, longitud;

  var funcionExito = function(posicion){
    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

  var miUbicacion = new google.maps.Marker({
    position: {lat:latitud, lng:longitud},
    animation: google.maps.Animation.DROP,
    map: map,

  });

  map.setZoom(17);
  map.setCenter({lat:latitud, lng:longitud});

  }

  var funcionError = function(error){
      alert("tenemos un problema con encontrar tu ubicación");
  }

  /* input */
  var inputO = (document.getElementById('origin-input'));
  var autocomplete = new google.maps.places.Autocomplete(inputO);
    autocomplete.bindTo('bounds', map);

  var inputD = (document.getElementById('destination-input'));
  var autocomplete = new google.maps.places.Autocomplete(inputD);
      autocomplete.bindTo('bounds', map);


  /* 
    DirectionsService: solicita indicaciones a google maps
    DirectionsDisplay : Muestra las indicaciones
  */
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
      
  document.getElementById('origin-input').addEventListener('change', onChangeHandler);
  document.getElementById('destination-input').addEventListener('change', onChangeHandler);

  function calcTrazadoRuta(directionsService, directionsDisplay) {
      directionsService.route({
      origin: document.getElementById('origin-input').value,
      destination: document.getElementById('destination-input').value,
      travelMode: 'DRIVING'
    }, 
    function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
          window.alert('No se encontró la ruta ' + status);
        }
    });
  } 

  /*Calcular distancia y precio*/
  function calcRuta() {
    var start = document.getElementById("origin-input").value;
    var end = document.getElementById("destination-input").value;
    var distanceInput = document.getElementById("output");
        
  var request = {
    origin:start, 
    destination:end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
  };
      
  directionsService.route(request, function(response, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);          
        var costo = (response.routes[0].legs[0].distance.value / 1000) * 500;
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class","costo");
        var resultado = document.createTextNode("$  " + costo);
        newDiv.appendChild(resultado);
        distanceInput.appendChild(newDiv);
      }
    }); 
  }

  /*onChangeHandler*/
  directionsDisplay.setMap(map);
  var onChangeHandler = function(){
    calcTrazadoRuta(directionsService, directionsDisplay);
    calcRuta();
  };  
    
  document.getElementById("trazar-ruta").addEventListener("click",onChangeHandler); 

}