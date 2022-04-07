var modal = document.getElementById('restaurant-display');
var btn = document.getElementById("submit-button");
var span = document.getElementById("close");

$("#submit-button").on("click", function() {
 event.preventDefault();

  var zipCode =  $("#zipcode").val();
  var radius = $("#radius").val() 
  // convert miles to meters
  var radius = Math.floor(radius*1609.344)
  // CORS headers are added to the proxied request via "https://cors-anywhere.herokuapp.com". However, cors-anywhere has been downgraded 
  // to a demo status so a working proxy alternative would be ideal. 
  var proxy = 'https://cors-anywhere.herokuapp.com/'
  var queryUrl =  proxy + 'https://api.yelp.com/v3/businesses/search?location=' + zipCode +
  '&term=restaurants&radius=' + radius + '&limit=30' ;

  console.log(zipCode);
  
  $.ajax({
    url:queryUrl,
    headers: {
        Authorization : 'Bearer H-CmHNyS5hde4Z8buw7yFhEtIWK_QR-ZU16VVjN-20CJmO4drUhuDbHrgfeWoeh64Vr9H1_YaZaELPtp-XIHTKGdmXgb2svuUSOgw-aJGsTjj570SlR52YWAtJRMYnYx'
    }
}).then(function(response) {

  var Locations = response.businesses;
  //pick random restaurant from array
  var random_num = Math.floor(Math.random() * Locations.length);
  var response_array = Locations[random_num];
  // pick a different restaurant if permanently closed
  var counter = 0;
  while (counter < 30 && (response_array.is_closed === 'true' || response_array == null)){
    random_num = Math.floor(Math.random() * Locations.length)
    response_array = Locations[random_num]
    counter ++ 
  }
    console.log(response_array)
    console.log(response_array.coordinates);
    //embed google maps based on restaurant coordinates.
    var lat = response_array.coordinates.latitude;
    var long = response_array.coordinates.longitude;
  
    updateMapCoordinates_restaurants(response_array.coordinates.latitude,response_array.coordinates.longitude);   
    //get event information after reponse for restaurants is received.
    event_function(lat,long);

      console.log(response_array.review_count)
      //fill html elements inside the modal with response data.
      $("#restaurant-name").html(response_array.name);
      $("#restaurant-address").html(response_array.location.display_address);
      $("#restaurant-distance").html(Number((response_array.distance * 0.000621371192).toFixed(1)) + " miles");
      $("#restaurant-price-range").html(response_array.price);  
      $("#restaurant-phone-number").html(response_array.display_phone); 
      $("#restaurant-star-rating").html(response_array.rating);   
      $("#restaurant-review-count").html(response_array.review_count);
      $("#restaurant-add-website").html("Yelp Link").attr("href", response_array.url);   
      $("#restaurant-website-image").attr("src",response_array.image_url);
      });

      setTimeout(function(){
        //wait for api responses 
        $(modal).css("opacity",1)
        $(modal).css("z-index",1)
        //hide empty html content if missing api data. 
        $('.modal-list li:has(span:empty,src:empty,href:empty,a:empty)').remove(); 
        $('li:empty').remove();
       }, 4000);
   
   });

span.onclick = function() {
  //hide modal when clicking on "x" or "&times;"
  clear_event_data();
  $(modal).css("opacity",0)
  $(modal).css("z-index",-99999)
}

var event_function = function(restaurant_latitude,restaurant_longitude){
  // set minimum start time for events to two hours in the future.
  start_time = Math.round((new Date()).getTime() / 1000) + 7200;
  // end time is twelve hours in the future.
  end_time = start_time + 36000 
  console.log(start_time)
  // get local events based on the latitude and longitude of the selected restaurant. Radius set to maximum 40,000 meters to help ensure a match.
  var categories = "&categories=" + "performing-arts,festivals-fairs,sports-active-life,nightlife,music,visual-arts,film,fashion"
  queryUrl = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/events?latitude=' + restaurant_latitude  + categories + '&longitude=' + restaurant_longitude +'&sort_on=time_start' + '&radius=40000' + '&start_date=' + start_time + '&end_date=' + end_time;
  $.ajax({
    url:queryUrl,
    headers: {
        Authorization : 'Bearer H-CmHNyS5hde4Z8buw7yFhEtIWK_QR-ZU16VVjN-20CJmO4drUhuDbHrgfeWoeh64Vr9H1_YaZaELPtp-XIHTKGdmXgb2svuUSOgw-aJGsTjj570SlR52YWAtJRMYnYx'
    },
}).then(function(response) {
  var events = response.events 
  var random_num = Math.floor(Math.random() * events.length);
  var response_array = events[random_num];
  var event_latitude = response_array.latitude
  var event_longitude = response_array.longitude
  //return valid event if canceled or not found at random array index.
  var counter = 0;
  while (counter < 30 && (response_array == null || response_array.is_canceled === 'true')){
    random_num = Math.floor(Math.random() * events.length)
    response_array = events[random_num]
    counter ++
  }
  console.log(response_array)
  console.log(restaurant_latitude + restaurant_longitude)
  var event_distance = Number(distance(restaurant_latitude,restaurant_longitude,event_latitude,event_longitude)).toFixed(1);
  updateMapCoordinates_events(event_latitude,event_longitude)
  
  var event_address = response_array.location.display_address.join(' ')
  // append each list item to ensure the event html is empty if no response is returned.
  
  //change restaurant column to take up half the space if event API response received.
  if (response_array.name !== "" && response_array.name !== null){
    $("#restaurant_column").attr('class', 'modal-list column small-6 align-center-left text-left disc')
  }
  $('<h2>Event</h2>').insertBefore("#event-map");
  $('<h3 id="event-name"></h3>').insertBefore("#event-map");
  $("#event-name").html(response_array.name);
  $('<li class="modal-information"> Categories: <span id="event-category"></span></li>').insertBefore("#event-map");
  var event_categories = response_array.category.replace(/-/g,' ');
  $("#event-category").html(event_categories)
  $('<li class="modal-information"> Address: <span id="event-address"></span></li>').insertBefore("#event-map");
  $("#event-address").html(event_address);
  $('<li class="modal-information"> Distance From Restaurant: <span id="event-distance"></span></li>').insertBefore("#event-map");
  $("#event-distance").html(event_distance + " miles");
  $('<li class="modal-information"> Cost: <span id="event-cost"></span></li>').insertBefore("#event-map")
  if (response_array.cost !== "" && response_array.cost !== null){
    $("#event-cost").html("$" + response_array.cost); }
  $('<li class="modal-information"> From <span id="event-start-time"></span> Until <span id="event-end-time"></span></li>').insertBefore("#event-map")
  $("#event-start-time").html(moment(response_array.time_start).format('MMMM Do, h:mm a'));
  if (response_array.time_end !== "" && response_array.time_end !== null){
  $("#event-end-time").html(moment(response_array.time_end).format('MMMM Do, h:mm a'));
  }
  // only add list items if present. 
  if (response_array.event_site_url !== "" && response_array.event_site_url !== null){
    $('<li class="modal-information"><a id="event-add-website">  </a></li>').insertBefore("#event-map")
    $("#event-add-website").html("Yelp Link").attr("href", response_array.event_site_url);
  }
  if (response_array.tickets_url !== "" && response_array.tickets_url !== null){
    $('<li class="modal-information"><a id="event-reserve">  </a></li>').insertBefore("#event-map")
    $("#event-reserve").html("Reserve").attr("href", response_array.tickets_url);
  }
  if (response_array.description !== "" && response_array.description !== null){
  $('<li class="modal-information"> Description: <span id="event-description"></span></li>').insertBefore("#event-map")
  $("#event-description").html(response_array.description)}

  console.log(event_distance)

})}

//stackoverflow snippet to find distance based on the haversine formula. Less accurate than google map directions.
function distance(lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1/180
  var radlat2 = Math.PI * lat2/180
  var theta = lon1-lon2
  var radtheta = Math.PI * theta/180
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  dist = dist * 1.609344 
  return dist
}

function clear_event_data(){
  $('#event_column').children().not("#event-map").remove();
}