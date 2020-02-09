// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-01-01&endtime=" +
  "2020-01-05&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

var localJson = "tectonicplates-master/GeoJSON/PB2002_steps.json";

var colors = ["#00d700", "#afff00", "#ffff00" ,"#ff5f00" ,"#ff0000" ,"#d70000"];
function getColor(d) {
  return d > 5 ? colors[5] :
         d > 4 ? colors[4] :
         d > 3 ? colors[3] :
         d > 2 ? colors[2] :
         d > 1 ? colors[1] :
                 colors[0];
}

d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function

  d3.json(localJson, function(platesdata) {
    // var platedata = platesdata.features;
    console.log(platesdata);

    // Tectonic plates layer
    var plates = L.geoJSON(platesdata, {
      style: {
        "color": "#ff7800",
        "weight": 2,
        "opacity": 1,
        fillOpacity: 0,
      }
    });

    // createFeatures(data.features, platedata.features);
    var earthquakes = L.geoJson(data.features, {
      pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, 
          {
            radius: feature.properties.mag*5, 
            fillColor: getColor(feature.properties.mag),
            color: getColor(feature.properties.mag),
            fillOpacity: 0.85,
            opacity: 0.8
          });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + " : " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
      }
    })

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street": streetmap,
      "Light": lightmap,
      "Dark": darkmap
    };

    // Create an overlay object
    var overlayMaps = {
      "Fault lines": plates,
      "Earthquakes": earthquakes,
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [ 37.09, -98 ],
      zoom: 5,
      layers: [darkmap, earthquakes, plates]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Set up the legend
    var legend = L.control({position: 'bottomright'});
    // var legend = L.control;
    legend.onAdd = function() {
      var div = L.DomUtil.create('div', 'info legend')
      var ranges = ["0-1","1-2","2-3","3-4","4-5","> 5"];

      ranges.forEach(function (range, index) {
        div.innerHTML += '<i style="background-color:' + colors[index] + '"> ' + ranges[index] + '</i> '+ '<br>';
      })
      return div
    }
    legend.addTo(myMap);
  });
  
});