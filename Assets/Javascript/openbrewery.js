var btn = document.getElementById("submit-button");
var result_card = document.querySelector("#grid-container-1")
var container = document.getElementsByClassName("container")[0]
var main_body = document.getElementsByTagName("main")[0];
var zip_code_latitude;
var zip_code_longitude;
var latitude;
var longitude;

var img_random_num
var result_storage;
result_storage = (localStorage.getItem("result_storage"))
result_storage = (result_storage) ? JSON.parse(result_storage) : [];
console.log(result_storage)
//global parameters 
var search_history_length = 6;

$("#submit-button").on("click", function() {
 event.preventDefault();
  var zipCode =  $("#zipcode").val();
  //if no geolocation then return zip code coordinates else return ip address coordinates.
  latitude = parseFloat(localStorage.getItem("ip_latitude"))
  longitude = parseFloat(localStorage.getItem("ip_longitude"))
  user_zip_code = parseInt(localStorage.getItem("user_zipcode"))
  if (user_zip_code != zipCode){
    $.ajax("https://thezipcodes.com/api/v1/search?zipCode=" + zipCode + "&apiKey=9f8032d8d5319e78db906f46c3803340"
    ).then(function(e) {
    for (var i = 0; i < e.location.length; i++){
      if(e.location[i].country == "US" || e.location[i].countryCode3 == "USA"){
        latitude = e.location[i].latitude
        longitude = e.location[i].longitude
      }}
	})}
  //wait 1.2 seconds to get coordinates before proceeding. 
  setTimeout(function(){ 
  var queryUrl = "https://api.openbrewerydb.org/breweries?by_dist=" + latitude +"," + longitude
  $.ajax({
    url:queryUrl,
    method:"GET",
}).then(function(response) {
  //remove old result
  if(document.getElementById("result-card") !== null){
  $('#result-card').remove();
}
  //fill html elements inside the modal with response data.
      //try to pick random brewery within 30 miles
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
        var random_num = Math.floor(Math.random() * response.length);
        response_array = response[random_num]
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

      var img_random_num_array;
      img_random_num_array = (localStorage.getItem("img_random_num_array"))
      img_random_num_array = (img_random_num_array) ? JSON.parse(img_random_num_array) : [];
      //generic brewery photos are used as content filler. obtained from "unsplash.com"
      var beerPhotos = [];
      beerPhotos = [
        "./assets/img/brewery-photos/brewery-0.jpg","./assets/img/brewery-photos/brewery-1.jpg", "./assets/img/brewery-photos/brewery-2.jpg", "./assets/img/brewery-photos/brewery-3.jpg",
        "./assets/img/brewery-photos/brewery-4.jpg", "./assets/img/brewery-photos/brewery-5.jpg", "./assets/img/brewery-photos/brewery-6.jpg",
        "./assets/img/brewery-photos/brewery-7.jpg", "./assets/img/brewery-photos/brewery-8.jpg", "./assets/img/brewery-photos/brewery-9.jpg",
        "./assets/img/brewery-photos/brewery-10.jpg", "./assets/img/brewery-photos/brewery-12.jpg", "./assets/img/brewery-photos/brewery-13.jpg", "./assets/img/brewery-photos/brewery-14.jpg",
        "./assets/img/brewery-photos/brewery-15.jpg",  "./assets/img/brewery-photos/brewery-16.jpg", "./assets/img/brewery-photos/brewery-17.jpg", "./assets/img/brewery-photos/brewery-18.jpg", 
        "./assets/img/brewery-photos/brewery-19.jpg", "./assets/img/brewery-photos/brewery-20.jpg", "./assets/img/brewery-photos/brewery-21.jpg", "./assets/img/brewery-photos/brewery-22.jpg", 
        "./assets/img/brewery-photos/brewery-23.jpg", "./assets/img/brewery-photos/brewery-24.jpg", "./assets/img/brewery-photos/brewery-25.jpg", "./assets/img/brewery-photos/brewery-26.jpg",
        "./assets/img/brewery-photos/brewery-27.jpg", "./assets/img/brewery-photos/brewery-28.jpg", "./assets/img/brewery-photos/brewery-29.jpg", "./assets/img/brewery-photos/brewery-30.jpg",
      ]
      //try to prevent subsequent results from getting the same random image.
      var i = 0;
      do {
      img_random_num = Math.floor(Math.random() * beerPhotos.length);
      i++;
      } while (img_random_num_array.includes(img_random_num) && i < beerPhotos.length)
      if (img_random_num_array.length == beerPhotos.length){ img_random_num_array = []};
      var temp_result_storage = localStorage.getItem("result_storage")
      var temp_container = [];
      var beerPhotos_src = beerPhotos[img_random_num]
      //make sure the same brewery name is assigned the same image.
      if (temp_result_storage && beerPhotos.length > 1) {
      temp_container = JSON.parse(temp_result_storage)
      other_temp_container = [];
      for (var i = 0; i < temp_container.length; i++){
        var other_temp_container = temp_container[i][2]
        if (other_temp_container.name == response_array.name){
          beerPhotos_src = temp_container[i][0]
          break }
        }
      }
      //store response data for later use 
      modified_response_array = [];
      modified_response_array.push(beerPhotos_src)
      modified_response_array.push(brewery_distance)
      modified_response_array.push(response_array)
      result_storage.push(modified_response_array)

      img_random_num_array.push(img_random_num)
      localStorage.setItem("img_random_num_array", JSON.stringify(img_random_num_array))

      let card_image = document.createElement('img')
      card_image.src = beerPhotos_src
      card_image.className = "card-image"
      card.appendChild(card_image)
      let card_section = document.createElement('div')
      card_section.className = "card-section"
      card_section.id = "card-body"
      card.appendChild(card_section)
      if(brewery_distance !== null && brewery_distance !== "" && brewery_distance !== NaN){
        let card_distance = document.createElement('p')
        card_distance.id = "brewery-distance"
        card_section.appendChild(card_distance)
        $("#brewery-distance").html("Distance: " + "<span>" + Number(brewery_distance).toFixed(1) + " miles" + "</span>");}
      // only format phone number if present
      if(response_array.phone !== null && response_array.phone !== "" && response_array.phone !== "null"){
        var phone_number = response_array.phone.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/, '$1$2$3-$4$5$6-$7$8$9$10')
        let card_phone_number = document.createElement('p')
        card_phone_number.id = "brewery-phone-number"
        card_section.appendChild(card_phone_number)
        $("#brewery-phone-number").html("Phone #: " + "<span>" + phone_number + "</span>")
      }
      if (response_array.street !== null && response_array.street !== ""){
        let card_address = document.createElement('p')
        card_address.id = "brewery-address"
        card_section.appendChild(card_address)
        $("#brewery-address").html("Distance: " + "<span>" + response_array.street + " " + response_array.city + " " + response_array.state + "</span>");}
      if (response_array.website_url !== null && response_array.website_url !== ""){
        let card_website = document.createElement('a')
        card_website.id = "brewery-add-website"
        card_section.appendChild(card_website)
        $("#brewery-add-website").html("href=" + response_array.website_url + ">" + "Website")
        $("#brewery-add-website").html("Website").attr("href", response_array.website_url);}
        //hide empty html content if missing api data. 
      $('#result-card div:has(span:empty,src:empty,href:empty,a:empty,p:empty)').remove(); 
      localStorage.setItem("result_storage",JSON.stringify(result_storage))
      modify_search_history();
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

//cell-0 is initially the most recent card
function modify_search_history(){
  var result_storage_temp = JSON.parse(localStorage.getItem("result_storage"))
  var temp_length = result_storage_temp.length
  //create grid if not present
  if (document.getElementById('grid-container-2') === null) {
    let grid_container_2 = document.createElement('div')
    grid_container_2.id = "grid-container-2"
    grid_container_2.className = "grid-container align-middle"
    main_body.appendChild(grid_container_2)
    let reset_icon = document.createElement("i")
    reset_icon.id = "reset-button"
    reset_icon.className = "fa fa-refresh fa-spin-hover"
    grid_container_2.appendChild(reset_icon)
    let grid_x = document.createElement('div')
    grid_x.id = "grid_x"
    grid_x.className = "grid-x medium" + " small-up-" + 1 + " medium-up-" + 1 + " large-up-" + 1 + " grid-padding-x medium-unstack equal-height-cards text-left"
    grid_container_2.appendChild(grid_x)

    //remove all local storage except user zipcode and ip coordinates.
    var reset = document.getElementById("reset-button");
    reset.addEventListener("click",function(){
      //change icon color when clicked
      reset.style.color = "brown"
      latitude = localStorage.getItem("ip_latitude")
      longitude = localStorage.getItem("ip_longitude")
      user_zip_code = localStorage.getItem("user_zipcode")
      $('#grid-container-2').remove();
      result_storage = [];
      //img_random_num_array = [];
      window.localStorage.clear();
      localStorage.setItem("ip_latitude", latitude)
      localStorage.setItem("ip_longitude", longitude)
      localStorage.setItem("user_zipcode", user_zip_code)
      $('#result-card').remove();
      setTimeout(function(){ 
        reset.style.color = "black"
      },400)
    })
  }

  //remove oldest search result if > search_history_length.
  if (result_storage_temp.length > search_history_length) {
    var id = $('#grid_x').children().last().attr('id');
    $("#grid_x").children("div[id=" + id + "]:last").remove()

  }
  if (result_storage_temp.length > 0) {
    sizes = resize_columns(result_storage_temp.length)
    var response_array = [];
    var response_array = result_storage_temp[(result_storage_temp.length -1)]
    var beerPhotos = response_array[0]
    var brewery_distance = parseFloat(response_array[1])
    var response_array = response_array[2]
    var cell = document.createElement('div')
    cell.className = "cell small-auto"
    cell.id = "cell-" + temp_length
    var grid_x = document.getElementById("grid_x");
    //update grid size 
    sizes = resize_columns(result_storage.length)
    grid_x.className = "grid-x medium" + " small-up-" + sizes[0] + " medium-up-" + sizes[1] + " large-up-" + sizes[2] + " grid-padding-x medium-unstack equal-height-cards text-left"
    grid_x.insertBefore(cell,grid_x.firstChild)
    var card = document.createElement('div')
    card.className = "card"
    cell.appendChild(card)
    var brewery_distance = distance(parseFloat(localStorage.getItem("ip_latitude")),parseFloat(localStorage.getItem("ip_longitude")),response_array.latitude,response_array.longitude)
    if (response_array.name !== null || response_array.name !== ""){
      let card_divider = document.createElement('div')
      card_divider.className = "card-divider"
      card_divider.id = "card-title"
      card.appendChild(card_divider)
      let card_name = document.createElement('h3')
      card_name.innerHTML = response_array.name
      card_divider.appendChild(card_name)
    }
    let card_image = document.createElement('img')
    card_image.src = beerPhotos
    card_image.className = "card-image"
    card.appendChild(card_image)
    let card_section = document.createElement('div')
    card_section.className = "card-section"
    card_section.id = "card-body"
    card.appendChild(card_section)
    if(brewery_distance !== null && brewery_distance !== "" && brewery_distance !== NaN){
      let card_distance = document.createElement('p')
      card_distance.id = "brewery-distance-" + temp_length
      card_section.appendChild(card_distance)
      $("#brewery-distance-" + temp_length).html("Distance: " + "<span>" + Number(brewery_distance).toFixed(1) + " miles" + "</span>");}
    if(response_array.phone !== null && response_array.phone !== "" && response_array.phone !== "null"){
      var phone_number = response_array.phone.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/, '$1$2$3-$4$5$6-$7$8$9$10')
      let card_phone_number = document.createElement('p')
      card_phone_number.id = "brewery-phone-number-" + temp_length
      card_section.appendChild(card_phone_number)
      $("#brewery-phone-number-" + temp_length).html("Phone #: " + "<span>" + phone_number + "</span>")
    if (response_array.street !== null && response_array.street !== ""){
      let card_address = document.createElement('p')
      card_address.id = "brewery-address-" + temp_length
      card_section.appendChild(card_address)
      $("#brewery-address-" + temp_length).html("Distance: " + "<span>" + response_array.street + " " + response_array.city + " " + response_array.state + "</span>");}
    if (response_array.website_url !== null && response_array.website_url !== ""){
      let card_website = document.createElement('a')
      card_website.id = "brewery-add-website-" + temp_length
      card_section.appendChild(card_website)
      $("#brewery-add-website-" + temp_length).html("href=" + response_array.website_url + ">" + "Website")
      $("#brewery-add-website-" + temp_length).html("Website").attr("href", response_array.website_url)
    };
    $('#cell-' + temp_length + "div:has(span:empty,src:empty,href:empty,a:empty,p:empty)").remove();
  }
}
}


function load_initial_search_history(){
  //max number of cards per row set to six
  if (result_storage.length > 0) {


    console.log(result_storage.length)
    sizes = resize_columns(result_storage.length)
    //console.log(sizes[0])
    //console.log(sizes[1])
    //console.log(sizes[2])
    let grid_container_2 = document.createElement('div')
    grid_container_2.id = "grid-container-2"
    grid_container_2.className = "grid-container align-middle"
    main_body.appendChild(grid_container_2)
    let reset_icon = document.createElement("i")
    reset_icon.id = "reset-button"
    reset_icon.className = "fa fa-refresh fa-spin-hover"
    grid_container_2.appendChild(reset_icon)
    let grid_x = document.createElement('div')
    grid_x.id = "grid_x"
    grid_x.className = "grid-x medium" + " small-up-" + sizes[0] + " medium-up-" + sizes[1] + " large-up-" + sizes[2] + " grid-padding-x medium-unstack equal-height-cards text-left"
    grid_container_2.appendChild(grid_x)

    //remove all local storage except user zipcode and ip coordinates.
    var reset = document.getElementById("reset-button");
    reset.addEventListener("click",function(){
      //change icon color when clicked
      reset.style.color = "brown"
      latitude = localStorage.getItem("ip_latitude")
      longitude = localStorage.getItem("ip_longitude")
      user_zip_code = localStorage.getItem("user_zipcode")
      $('#grid-container-2').remove();
      result_storage = [];
      //img_random_num_array = [];
      window.localStorage.clear();
      localStorage.setItem("ip_latitude", latitude)
      localStorage.setItem("ip_longitude", longitude)
      localStorage.setItem("user_zipcode", user_zip_code)
      $('#result-card').remove();
      setTimeout(function(){ 
        reset.style.color = "black"
      },400)
    })

    for (var i = 0; (i < search_history_length && i < result_storage.length); i++) {
          var response_array = [];
          var response_array = result_storage[(result_storage.length -1) -i]
          //console.log(response_array)
          var beerPhotos = response_array[0]
          //console.log(beerPhotos)
          var brewery_distance = parseFloat(response_array[1])
          //console.log(brewery_distance)
          var response_array = response_array[2]
          //console.log(response_array)
          var cell = document.createElement('div')
          cell.className = "cell small-auto"
          cell.id = "cell-" + i 
          grid_x.appendChild(cell)
          var card = document.createElement('div')
          card.className = "card"
          cell.appendChild(card)
          var brewery_distance = distance(parseFloat(localStorage.getItem("ip_latitude")),parseFloat(localStorage.getItem("ip_longitude")),response_array.latitude,response_array.longitude)
          if (response_array.name !== null || response_array.name !== ""){
            let card_divider = document.createElement('div')
            card_divider.className = "card-divider"
            card_divider.id = "card-title"
            card.appendChild(card_divider)
            let card_name = document.createElement('h3')
            card_name.innerHTML = response_array.name
            card_divider.appendChild(card_name)
          }
          let card_image = document.createElement('img')
          card_image.src = beerPhotos
          card_image.className = "card-image"
          card.appendChild(card_image)
          let card_section = document.createElement('div')
          card_section.className = "card-section"
          card_section.id = "card-body"
          card.appendChild(card_section)
          if(brewery_distance !== null && brewery_distance !== "" && brewery_distance !== NaN){
            let card_distance = document.createElement('p')
            card_distance.id = "brewery-distance-" + i
            card_section.appendChild(card_distance)
            $("#brewery-distance-" + i).html("Distance: " + "<span>" + Number(brewery_distance).toFixed(1) + " miles" + "</span>");}
          if(response_array.phone !== null && response_array.phone !== "" && response_array.phone !== "null"){
            var phone_number = response_array.phone.replace(/(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)(\d)/, '$1$2$3-$4$5$6-$7$8$9$10')
            let card_phone_number = document.createElement('p')
            card_phone_number.id = "brewery-phone-number-" + i
            card_section.appendChild(card_phone_number)
            $("#brewery-phone-number-" + i).html("Phone #: " + "<span>" + phone_number + "</span>")
          if (response_array.street !== null && response_array.street !== ""){
            let card_address = document.createElement('p')
            card_address.id = "brewery-address-" + i
            card_section.appendChild(card_address)
            $("#brewery-address-" + i).html("Distance: " + "<span>" + response_array.street + " " + response_array.city + " " + response_array.state + "</span>");}
          if (response_array.website_url !== null && response_array.website_url !== ""){
            let card_website = document.createElement('a')
            card_website.id = "brewery-add-website-" + i
            card_section.appendChild(card_website)
            $("#brewery-add-website-" + i).html("href=" + response_array.website_url + ">" + "Website")
            $("#brewery-add-website-" + i).html("Website").attr("href", response_array.website_url)
          };
          $('#cell-' + i + "div:has(span:empty,src:empty,href:empty,a:empty,p:empty)").remove();
        }
      }
    }
  } 

function resize_columns(array_length){
  let small, medium, large;
  if(array_length == 1) {
    small=1,medium=1,large=1
  } else if (array_length == 2){
    small=1,medium=2,large=2
  } else if (array_length == 3){
    small=2, medium=3,large=3
  } else if (array_length == 4){
    small=2, medium=2, large=2
  } else if (array_length == 5){
    small=2, medium=3, large=3
  } else if (array_length == 6){
    small=2, medium=3,large=3
  } else if (array_length >= 7){
    small=2, medium=3, large=3
  }
  return [small,medium,large]
}

load_initial_search_history();

