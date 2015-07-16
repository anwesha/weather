$(function() {

	var APPID	= '';	// Yahoo App ID
	    DEG 	= 'c';	// c : celsius, f : fahrenheit

	// check if browser supports geolocation
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(_handleSuccess, _handleError);
	} else {
		_showErrorMessage('your browser doesnt support geolocation : do you know the flintstones?');
	}

	function _showErrorMessage (msg) {
		$('#error-message').html(msg);
	}

	function _handleSuccess (position) {
		var latitude  = position.coords.latitude,
			longitude = position.coords.longitude;
var yqlQuery = 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="los angeles")';
var url = "https://query.yahooapis.com/v1/public/yql?q=" + encodeURIComponent(yqlQuery) + "&format=json";
		$.ajax({
			url: url
		}).done(function(err, data) {
			console.log(err);
			console.log(data);
		});
	}


	function _handleError (err) {
		var msg;
	    switch(err.code) {
	        case err.PERMISSION_DENIED:
	            msg = 'User denied the request for Geolocation.'
	            break;
	        case err.POSITION_UNAVAILABLE:
	            msg = 'Location information is unavailable.'
	            break;
	        case err.TIMEOUT:
	            msg = 'The request to get user location timed out.'
	            break;
	        case err.UNKNOWN_ERROR:
	            msg = 'I dont know what happened!.'
	            break;
	    }

	    _showErrorMessage(msg);
	}
});




/*
		var ur = 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude;

		$.ajax({
			url: ur
		}).done(function(err, data){
			console.log(err);
			console.log(data);
		});
*/