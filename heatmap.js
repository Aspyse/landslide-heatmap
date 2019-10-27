var map;
var data;
var heatmap;
var markers;
var markerClusterer;
var displaymode = "heatmap";
var weights = ["small","medium","large","very_large"];
function initMap() {
	//get csv and parse to rawFile
	var rawFile = new XMLHttpRequest();
	rawFile.addEventListener("load", reqListener);
	rawFile.open("GET", "https://raw.githubusercontent.com/Aspyse/landslide-heatmap/master/g.csv", true);
	rawFile.send();

	function reqListener(){
		//convert csv text to objects
		var csvText = this.responseText;
		data = jQuery.csv.toObjects(csvText);

		//init map
		map = new google.maps.Map(document.getElementById('map'), {
	  		center: {lat: 0, lng: 0},
	  		zoom: 2,
	  		mapTypeId: 'terrain'
		});

		//prep data for heatmap
		var heatmapData = [];
		
		//heatmap
		data.forEach(function(landslide) {
	  		var latLng = new google.maps.LatLng(parseFloat(landslide.latitude),parseFloat(landslide.longitude));
	  		var w = 2;
	  		for (var i = 0; i < weights.length; i++)
	  			if (landslide.landslide_size == weights[i])
	  				w = (i+1);
	  		var weightedLoc = {
	  			location: latLng,
	  			weight: w
	  		};
	  		heatmapData.push(weightedLoc);
		});
		heatmap = new google.maps.visualization.HeatmapLayer({
		    data: heatmapData,
		    dissipating: false,
		    map: map
		});
		
		//markers and clusters
		markers = data.map(function(landslide, i) {
			return new google.maps.Marker({
				position: new google.maps.LatLng(parseFloat(landslide.latitude),parseFloat(landslide.longitude)),
			});
		});
		markerClusterer = new MarkerClusterer(map, markers,
			{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
		markerClusterer.clearMarkers();
	}
}
function redraw() {
	heatmap.setMap(null);
	markerClusterer.clearMarkers();
	if (displaymode == "heatmap") {
		heatmap.setMap(map);
	} else if (displaymode == "circles") {
		for (var i = 0; i < data.length; i++) {
			var w = 2;
	  		for (var k = 0; k < weights.length; k++)
	  			if (data[i].landslide_size == weights[k])
	  				w = (k+1);
			markers[i].setIcon({
				path: google.maps.SymbolPath.CIRCLE,
				fillColor: 'red',
				fillOpacity: .2,
				scale: w,
				strokeColor: 'white',
				strokeWeight: .5
			});
		}
		markers.forEach(function(marker) {
			marker.setMap(map);
		});
	} else {
		markerClusterer = new MarkerClusterer(map, markers,
			{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
	}
}
$(function() {
	console.log("init radios...");
	$('input[type=radio][name=display-mode]').change(function() {
	  displaymode = this.value;
	  redraw();
	});
  });