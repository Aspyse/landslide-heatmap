var map;
function initMap() {
	var rawFile = new XMLHttpRequest();
	rawFile.addEventListener("load", reqListener);
	rawFile.open("GET", "https://raw.githubusercontent.com/Aspyse/landslide-heatmap/master/g.csv", true);
	rawFile.send();

	function reqListener(){
		var csvText = this.responseText;
		var data = jQuery.csv.toObjects(csvText);
		map = new google.maps.Map(document.getElementById('map'), {
	  		center: {lat: 0, lng: 0},
	  		zoom: 2,
	  		mapTypeId: 'terrain'
		});
		var heatmapData = [];
		var weights = ["small","medium","large","very_large"];
		data.forEach(function(landslide) {
	  		var latLng = new google.maps.LatLng(parseFloat(landslide.latitude),parseFloat(landslide.longitude));
	  		var w = 2;
	  		for (i = 0; i < weights.length; i++)
	  			if (landslide.landslide_size == weights[i])
	  				w = (i+1);
	  		var weightedLoc = {
	  			location: latLng,
	  			weight: w
	  		};
	  		heatmapData.push(weightedLoc);
		});
		console.log(heatmapData);
		var heatmap = new google.maps.visualization.HeatmapLayer({
		    data: heatmapData,
		    dissipating: false,
		    map: map
	    });
	}
}