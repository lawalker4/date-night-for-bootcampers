var modal = document.getElementById("brewery-display");
var btn = document.getElementById("submit-button");
var span = document.getElementById("close");
var result_card = document.querySelector("#grid-container-1")
var zip_code_latitude;
var zip_code_longitude;
var latitude;
var longitude;
var img_random_num_array = [];
var img_random_num

$("#submit-button").on("click", function() {
 event.preventDefault();
  var zipCode =  $("#zipcode").val();
  //if no geolocation then return zip code coordinates else return ip address coordinates.
  latitude = parseFloat(localStorage.getItem("ip_latitude"))
  longitude = parseFloat(localStorage.getItem("ip_longitude"))
  if (user_zip_code != zipCode || ip_bool == "False"){
    $.get("https://thezipcodes.com/api/v1/search?zipCode=" + zipCode + "&apiKey=9f8032d8d5319e78db906f46c3803340"
    ).then(function(e) {
    for (var i = 0; i < e.location.length; i++){
      if(e.location[i].country == "US" || e.location[i].countryCode3 == "USA"){
        latitude = e.location[i].latitude
        longitude = e.location[i].longitude
      }}
	})}
  //wait 1.2 seconds to get coordinates before proceeding.
  setTimeout(function(){ 
  console.log(latitude)
  var queryUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + latitude +"," + longitude

  $.ajax({
    url:queryUrl,
}).then(function(response) {
  //remove old result
  if(document.getElementById("result-card") !== null){
  $('#result-card').remove();}
  //fill html elements inside the modal with response data.
      //try to pick random brewery within 30 miles else pick closest.
      var i = 0;
      do{ 
        var random_num = Math.floor(Math.random() * response.length);
        var response_array = response[random_num];
        // only return distance if ip coordinates exist. 
        if(localStorage.getItem("ip_latitude") !== null){
        var brewery_distance = distance(parseFloat(localStorage.getItem("ip_latitude")),parseFloat(localStorage.getItem("ip_longitude")),response_array.latitude,response_array.longitude);
        i ++;
    }} while (brewery_distance > 30 && i < 20)
      if (brewery_distance > 30) {
        response_array = response[0]
        var brewery_distance = distance(parseFloat(localStorage.getItem("ip_latitude")),parseFloat(localStorage.getItem("ip_longitude")),response_array.latitude,response_array.longitude);
      }
      console.log(response_array)

      let cell = document.createElement('div')
      cell.className = "cell small-auto"
      cell.id = "result-card"
      result_card.appendChild(cell)
      let card = document.createElement('div')
      card.className = "card"
      cell.appendChild(card)

      if (response_array.name !== null || response_array.name !== ""){
        let card_divider = document.createElement('div')
        card_divider.className = "card-divider"
        card_divider.id = "card-title"
        card.appendChild(card_divider)
        let card_name = document.createElement('h3')
        card_name.innerHTML = response_array.name
        card_divider.appendChild(card_name)

      //generic brewery photos are used as content filler. obtained from "unsplash.com"
      var beerPhotos = [];
      beerPhotos = [
        "./assets/img/brewery-photos/brewery-0.jpg","./assets/img/brewery-photos/brewery-1.jpg", "./assets/img/brewery-photos/brewery-2.jpg", "./assets/img/brewery-photos/brewery-3.jpg",
        "./assets/img/brewery-photos/brewery-4.jpg", "./assets/img/brewery-photos/brewery-5.jpg", "./assets/img/brewery-photos/brewery-6.jpg",
        "./assets/img/brewery-photos/brewery-7.jpg", "./assets/img/brewery-photos/brewery-8.jpg", "./assets/img/brewery-photos/brewery-9.jpg",
        "./assets/img/brewery-photos/brewery-10.jpg", "./assets/img/brewery-photos/brewery-12.jpg", "./assets/img/brewery-photos/brewery-13.jpg", "./assets/img/brewery-photos/brewery-14.jpg",
        "./assets/img/brewery-photos/brewery-15.jpg",  "./assets/img/brewery-photos/brewery-16.jpg", "./assets/img/brewery-photos/brewery-17.jpg", "./assets/img/brewery-photos/brewery-18.jpg", 
        "./assets/img/brewery-photos/brewery-19.jpg", "./assets/img/brewery-photos/brewery-20.jpg", "./assets/img/brewery-photos/brewery-21.jpg", "./assets/img/brewery-photos/brewery-22.jpg", 
      ]
      //try to prevent subsequent results from getting the same random image.
      var i = 0;
      do {
      img_random_num = Math.floor(Math.random() * beerPhotos.length);
      i++;
      } while (img_random_num_array.includes(img_random_num) && i < 22)
      if (img_random_num_array.length == 23){ img_random_num_array = []};
      img_random_num_array.push(img_random_num)
      let card_image = document.createElement('img')
      card_image.src = beerPhotos[img_random_num]
      card_image.className = "card-image"
      card.appendChild(card_image)
      let card_section = document.createElement('div')
      card_section.className = "card-section"
      card_section.id = "card-body"
      card.appendChild(card_section)
      if(brewery_distance !== null || brewery_distance !== ""){
        let card_distance = document.createElement('p')
        card_distance.id = "brewery-distance"
        card_section.appendChild(card_distance)
        $("#brewery-distance").html("Distance: " + "<span>" + Number(brewery_distance).toFixed(1) + " miles" + "</span>");}
      // only format phone number if present
      if(response_array.phone !== null || response_array.phone !== ""){
        var phone_number = response_array.phone.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/, '$1$2$3-$4$5$6-$7$8$9$10')
        let card_phone_number = document.createElement('p')
        card_phone_number.id = "brewery-phone-number"
        card_section.appendChild(card_phone_number)
        $("#brewery-phone-number").html("Phone #: " + "<span>" + phone_number + "</span>")
      }
      if (response_array.street !== null || response_array.street !== ""){
        let card_address = document.createElement('p')
        card_address.id = "brewery-address"
        card_section.appendChild(card_address)
        $("#brewery-address").html("Distance: " + "<span>" + response_array.street + " " + response_array.city + " " + response_array.state + "</span>");}
      if (response_array.website_url !== null || response_array.website_url !== ""){
        let card_website = document.createElement('a')
        card_website.id = "brewery-add-website"
        card_section.appendChild(card_website)
        $("#brewery-add-website").html(" href=" + response_array.website_url + ">" + "Website")
        $("#brewery-add-website").html("Website").attr("href", response_array.website_url);}
      //hide empty html content if missing api data. 
      $('#result-card div:has(span:empty,src:empty,href:empty,a:empty,p:empty)').remove(); 
      }});
   },1200)});

//stackoverflow snippet to find distance based on the haversine formula. 
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
