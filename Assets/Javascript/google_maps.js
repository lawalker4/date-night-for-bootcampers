$(document).ready(function(){
    var restaurant_map;
    var event_map;
    var restaurant_marker;
    var event_marker;
    
    window.updateMapCoordinates_restaurants = function(latitude,longitude) {
  
      var position = new google.maps.LatLng(latitude, longitude);
  
      if(!restaurant_marker) {
        restaurant_marker = new google.maps.Marker({
          map: restaurant_map,
          position: position
        });
  
      } else {
        restaurant_marker.setPosition(position);
      }
      
      restaurant_map.panTo(position);
      restaurant_map.setZoom(16);
      document.getElementById("restaurant-map").style.display = "block";
      
    };

    window.updateMapCoordinates_events = function(latitude,longitude) {
  
      var position = new google.maps.LatLng(latitude, longitude);
  
      if(!event_marker) {
        event_marker = new google.maps.Marker({
          map: event_map,
          position: position
        });
  
      } else {
        event_marker.setPosition(position);
      }
      
      event_map.panTo(position);
      event_map.setZoom(16);
      document.getElementById("event-map").style.display = "block";
      
    };
    function initMap(){
      var options = {
        scaleControl: true,
        center: new google.maps.LatLng(0.0, 0.0),
        zoom:16,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      restaurant_map = new google.maps.Map(document.getElementById("restaurant-map"), options);
      event_map = new google.maps.Map(document.getElementById("event-map"), options);
      
    }
    
    fetch("https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key=AIzaSyDrLghRlMxsjkS5d-wcE_FiDrOhCTN9r9U&callback=initMap")
    .then(function(response){
      initMap();
    })
    document.getElementById("restaurant-map").style.display = "none";
    document.getElementById("event-map").style.display = "none";
  });