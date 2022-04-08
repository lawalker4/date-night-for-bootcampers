var modal = document.getElementById('restaurant-display');
var btn = document.getElementById("submit-button");
var span = document.getElementById("close");
var zip_code_latitude;
var zip_code_longitude;
var latitude;
var longitude;

$("#submit-button").on("click", function() {
 event.preventDefault();
  var zipCode =  $("#zipcode").val();
  //if no geolocation then return zip code coordinates else return ip address coordinates.
  latitude = ip_latitude
  longitude = ip_longitude
  if (user_zip_code != zipCode || ip_bool == "False"){
	$.get("https://thezipcodes.com/api/v1/search?zipCode=" + zipCode + "&apiKey=9f8032d8d5319e78db906f46c3803340"
	).then(function(e) {
	for (var i = 0; i < e.location.length; i++){
		if(e.location[i].country == "US" || e.location[i].countryCode3 == "USA"){
			latitude = e.location[i].latitude
			longitude = e.location[i].longitude
    }}
    
		
	})}
  //wait 1.2 seconds to get zip code before proceeding.
  setTimeout(function(){ 
  console.log(latitude)
  var queryUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + latitude +"," + longitude

  
  $.ajax({
    url:queryUrl,
}).then(function(response) {
  console.log(response)
      var brewery_distance = distance(latitude,longitude,response[0].latitude,response[0].longitude);
      //fill html elements inside the modal with response data.
      $("#restaurant-name").html(response[0].name);
      $("#restaurant-address").html(response[0].street + " " + response[0].city + " " + response[0].state);
      $("#restaurant-distance").html(Number(brewery_distance).toFixed(1) + " miles");
      $("#restaurant-phone-number").html(response[0].phone); 
      $("#restaurant-add-website").html("Website").attr("href", response[0].website_url);   
      $("#restaurant-website-image").attr("src","");
      });

      setTimeout(function(){
        //wait for api responses 
        $(modal).css("opacity",1)
        $(modal).css("z-index",1)
        //hide empty html content if missing api data. 
        $('.modal-list li:has(span:empty,src:empty,href:empty,a:empty)').remove(); 
        $('li:empty').remove();
       }, 1500);
   
   },1200)});

span.onclick = function() {
  //hide modal when clicking on "x" or "&times;"
  //save_data();
  $(modal).css("opacity",0)
  $(modal).css("z-index",-99999)
}

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

function save_data(){
  //save card data to local storage
}

$(function(){
  //load search history on page load from local storage 
})