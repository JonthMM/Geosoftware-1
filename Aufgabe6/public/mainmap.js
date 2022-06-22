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

var datalength;

/* see serverstart.js 
var L = require('leaflet');
*/

// creating a leaflet map for the busstops
var basemap = L.map('busStopMap', {
  center: [51.9606649, 7.6261347],
  zoom: 13
});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  tileSize: 512,
  zoomOffset: -1
}).addTo(basemap);

/**
 * @function addBusStops
 * @desc maps the bus stops on the map as default circle
 */

function addBusStops() {

  var busStops;
  var allBusstops = L.geoJSON((pointcloud), {
    pointToLayer: function (features, latlng) {
      return L.circle(latlng);
    },
    // creating a header for the bus stop information table
    onEachFeature: function (feature, layer) {
      departureTimeResults = feature.properties.nr;
      layer.bindPopup('<strong>' + feature.properties.lbez + '</strong> <br/>' + departureTimeResults);

    }
  }).addTo(basemap).on('click', onClick);
}

/**
 * @function onClick
 * @desc if the user clicks on a busstop circle, this function gets called
 */

var popup;
var nameOfBusStop;

function onClick(e) {
  popup = e.latlng;
  var businfos = e.layer.getPopup();
  basemap.closePopup();

  businfos = businfos._content;
  var busStopID = businfos.slice(-7);
  nameOfBusStop = businfos.slice(0, -7);

  abfahrten(busStopID);
  busStopID = '';
}

/**
 * @function displayDatabaseData
 * @desc calls the data stored in the MongoDB database by the user and makes it displayable
 */

async function displayDatabaseData() {
  let result = await promise();
  singleOptionSelectionList(result);
}

/**
 * @function promise
 * @desc /item request to the server with JQuery
 */

function promise() {

  return new Promise(function (res, req) {
    $.ajax({
      url: "/item",
      success: function (result) {
        res(result);
      },
      error: function (err) {
        console.log(err);
      }
    });
  });
}

/**
 * @function singleOptionSelectionList
 * @desc this function is for creating a single option selection list (radio) for the user to choose one location for calculating the nearest bus stops
 */

function singleOptionSelectionList(result) {
  datalength = result.length;
  // list of database content
  for (var i = 0; i < result.length; i++) {
    var ul = document.getElementById('ul');
    var li = document.createElement('li' + i);

    var checkbox = document.createElement('input');
    // radio for single selection
    checkbox.type = "radio";
    checkbox.id = "checkboxid" + i;
    checkbox.value = JSON.stringify(result[i]);
    checkbox.name = "location";

    li.appendChild(checkbox);
    li.appendChild(document.createTextNode(JSON.stringify(result[i])));
    ul.appendChild(li);
    ul.appendChild(document.createElement("br"));
    ul.appendChild(document.createElement("br"));
  }
}

/**
 * @function valueConverter
 * @desc calls pushAndSort function to display the busstop information on the webpage with the checked database content
 * and if needed converts it to float values
 */

function valueConverter() {
  var value = [];
  var coordinatesStoredInDatabase;
  // checked item
  for (var i = 0; i < datalength; i++) {
    if (document.getElementById("checkboxid" + i).checked) {
      value = document.getElementById("checkboxid" + i).value;
      value = JSON.parse(value);
      coordinatesStoredInDatabase = value.geometry.coordinates;

      // string to float conversion if needed
      if (typeof coordinatesStoredInDatabase[0] === "string") {

        coordinatesStoredInDatabase = coordinatesStoredInDatabase[0];
        coordinatesStoredInDatabase = coordinatesStoredInDatabase.split(',');

        parseFloat(coordinatesStoredInDatabase[0]);
        parseFloat(coordinatesStoredInDatabase[1]);

        inputLocation = coordinatesStoredInDatabase;
        mainMapUserInput(inputLocation);
        pushAndSort();
      } else {
        inputLocation = value.geometry.coordinates;

        pushAndSort();
        mainMapUserInput(inputLocation);
      }
    }
  }
}

/**
 * @function mainMapUserInput
 * @desc function for displaying the checked database content by the user on the map
 */

var mainMapMarker = [];

function mainMapUserInput(convertedAdress) {
  mainMapMarker.length = 0;
  mainMapMarker = L.marker([convertedAdress[1], convertedAdress[0]], {
    icon: positioning
  }).addTo(basemap);
}

// styling for the icon for the positioning on the map
var positioning = L.icon({
  iconUrl: 'public/position.png',
  iconSize: [25, 25], // size of the icon
});
