function initialize() {
  //var place = new google.maps.LatLng(35.6270374,139.342189);
  var place = new google.maps.LatLng(42.345573,-71.098326);
  var mapOptions = {
	center: place,
	zoom: 14,
	mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("canvas_eventCanvas"),
	mapOptions);
  var panoramaOptions = {
	position:place,
	pov: {
		heading:34,
		pitch:10
	}
  };
}

