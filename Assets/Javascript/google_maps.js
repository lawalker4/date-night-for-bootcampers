$(document).ready(function(){
  
    var map;
    var marker;
    var directionsDisplay;
    var trafficLayer;
    
    
    window.updateMapCoordinates = function(coord) {
  
      var position = new google.maps.LatLng(coord.latitude, coord.longitude);
  
      if(!marker) {
        marker = new google.maps.Marker({
          map: map,
          position: position
        });
  
      } else {
        marker.setPosition(position);
      }
      
      var street = $("#user-street").val();
      var city = $("#user-city").val();
      var state = $("#user-state").val();
      var origin = street + ', ' + city + ', ' + state;
      map.panTo(position);
      map.setZoom(13);
      document.getElementById("map").style.display = "block";
      
    };
  
    function initMap(){
      var options = {
        scaleControl: true,
        zoom:13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      map = new google.maps.Map(document.getElementById("map"), options);

      directionsDisplay = new google.maps.DirectionsRenderer;
      trafficLayer = new google.maps.TrafficLayer;

      directionsDisplay.setMap(map);
      trafficLayer.setMap(map);
      
    }
    
    fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=&callback=initMap")
    .then(function(response){
      initMap();
    })
    document.getElementById("map").style.display = "none";
  });