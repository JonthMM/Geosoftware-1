/**
 * Aufgabe 6, Geosoft 1, SoSe 2022
 * @author Jonathan Mader, matr.Nr.: 502644
 * @author Erkam Dogan, matr.Nr.: 508236
 * @author Kieran Galbraith, matr.Nr.: 453493
 */

//****various Linter configs****
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097

// declaration of global variables
var departure;
var pointcloud = [];
var departureArray = [];
var allDepartures = [];

// execution of the haltestellen function at first to display them on the map when the page loads
haltestellen();

// creating a title for our website (and displaying it with alert pop up)
document.title = "This is Assignement 6 for Geosoftware 1 by Jonathan Mader, Erkam Dogan and Kieran Galbraith";
alert(document.title);


/**
 * @function haltestellen
 * @desc method fetches the wanted information from the API
 * about the busstops from it and then uses this data to fill the pointcloud array
 * and calling the main method with the new data
 */
async function haltestellen() {

  const API_URL = "https://rest.busradar.conterra.de/prod";
  const response = await fetch(API_URL + `/haltestellen`);
  const data = await response.json();
  pointcloud = data;

  if (document.getElementById('busStopMap')) {
    addBusStops();
  }

}

/**
 * @function abfahrten
 * @desc fetching the departures from the API for the next 30 minutes
 */

async function abfahrten(output) {

  let resource = "https://rest.busradar.conterra.de/prod/haltestellen/" + output + "/abfahrten?sekunden=1800";
  const response = await fetch(resource);
  const data = await response.json();
  departure = data;
  // creation of an array with all departure-JSON-objects
  for (var i = 0; i < departure.length; i++) {
    departureArray.push(departure[i]);
  }
  departure = departureArray;
  timeConverter(departure);
}


/**
 * @function getLocation callback function
 * @desc gets the location of the user
 * source: https://www.w3schools.com/html/html5_geolocation.asp
 */

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    document.getElementById('browserLocation').innerHTML = "Geolocation is not supported by this browser.";
  }
}

/**
 * @function showPosition
 * @desc user position to GeoJSON converting and calls userLocationMapping to show the position on the map
 * @param position JSON object of the user
 * @source: https://www.w3schools.com/html/html5_geolocation.asp
 */
function showPosition(position) {
  let userLocation = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [position.coords.longitude, position.coords.latitude]
      },
      "properties": {}
    }]
  };
  JSON.parse('{"userLocation":true}');
  inputLocation = userLocation.features[0].geometry.coordinates;
  userLocationMapping();
}