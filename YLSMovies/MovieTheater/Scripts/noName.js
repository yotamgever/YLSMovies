// First, create an object containing LatLng and population for each city.
var countrymap = {};
$.ajax({
    url: "Country/getAllCountries",
    type: "GET",
    success: function (data) {
        for (i = 0; i < data.length; i++) {
            countrymap[data[i].Name] = {
                center: new google.maps.LatLng(data[i].Latitude, data[i].Longitude),
                population: data[i].CountryID * 1000
            };
        }
        debugger;
        initialize();
    }
});


var countryCircle;
function initialize() {
    debugger;
    var mapOptions = {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    // Construct the circle for each value in citymap.
    // Note: We scale the area of the circle based on the population.
    for (var country in countrymap) {
        var populationOptions = {
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: countrymap[country].center,
            radius: Math.sqrt(countrymap[country].population) * 100
        };
        // Add the circle for this city to the map.
        countryCircle = new google.maps.Circle(populationOptions);
    }
}
google.maps.event.addDomListener(window, 'load', initialize);
