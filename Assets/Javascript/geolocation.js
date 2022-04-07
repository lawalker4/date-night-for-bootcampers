var zip_code; 
var ip;

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(GetZipCode);
	}
}

//get zipcode from IP address
function GetZipCode() {
		ip = GetIP()
		//console.log(ip)
		$.get("http://ip-api.com/json/" + ip, function(e){ 
			zip_code = e.zip 
		  });
		//console.log(zip_code)
		$('#zipcode').val(zip_code)
	};

//get IP address
function GetIP(){
	$.ajaxSetup({async: false});
	$.get('https://api.ipify.org/?format=json', function(e){ 
	  ip = e.ip; 
	});
	return ip;
  }

getLocation()
