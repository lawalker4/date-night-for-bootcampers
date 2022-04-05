var modal = document.getElementById('restaurant-display');
var btn = document.getElementById("submit-button");
var span = document.getElementById("close");

$("#submit-button").on("click", function() {
 event.preventDefault();

  var zipCode =  $("#zipcode").val();
  var radius = $("#radius").val() 
  var radius = Math.floor(radius*1609.344)
  var queryUrl =  'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=' + zipCode +
  '&term=restaurants&radius=' + radius + '&limit=30' ;

  console.log(zipCode);
  
  $.ajax({
    url:queryUrl,
    headers: {
        Authorization : 'Bearer H-CmHNyS5hde4Z8buw7yFhEtIWK_QR-ZU16VVjN-20CJmO4drUhuDbHrgfeWoeh64Vr9H1_YaZaELPtp-XIHTKGdmXgb2svuUSOgw-aJGsTjj570SlR52YWAtJRMYnYx'
    }
}).then(function(response) {

  var Locations = response.businesses;
  var random_num = Math.floor(Math.random() * Locations.length);
  var response_array = Locations[random_num];
    console.log(response_array)
    console.log(response_array.coordinates);
    updateMapCoordinates(response_array.coordinates);   

      $("#restaurant-name").html(response_array.name);
      $("#address").html(response_array.location.display_address);
      $("#distance").html(Number((response_array.distance * 0.000621371192).toFixed(1)) + " miles");
      $("#price-range").html(response_array.price);  
      $("#phone-number").html(response_array.display_phone); 
      $("#star-rating").html(response_array.rating);   
      $("#add-website").attr("href", response_array.url);   
      $("#website-image").attr("src",response_array.image_url);
      });
      
      //event_function(lat,long)

      setTimeout(function(){
        $(modal).css("opacity",1)
        $(modal).css("z-index",1)
       }, 3500);
   
   });

span.onclick = function() {
  modal.style.display = "none";
  $(modal).css("opacity",0)
  $(modal).css("z-index",-99999)
}

var event_function = function(lat,long){
  queryUrl = 'https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/events?latitude=' + lat + '&longitude=' + long ;

}