
//attempt geolocation 
function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(GetZipCode);
	}
}

//get geolocation data from IP address
function GetZipCode() {
		$.get("https://api.freegeoip.app/json/?apikey=f359b860-b76b-11ec-98a5-ef0834c39bc8", function(e){ 
			setTimeout(function(){
				//early exit if no response 
				return;
			   }, 3000);
			   
			localStorage.setItem("user_zipcode", String(e.zip_code ))
			localStorage.setItem("ip_latitude", String(e.latitude))
			localStorage.setItem("ip_longitude", String(e.longitude))
			$('#zipcode').val(e.zip_code)
		  });
	};

getLocation();