/**
 * Aufgabe 4, Geosoft 1, SoSe 2022
 * @author Jonathan Mader, matr.Nr.: 502644
 */

"use strict"

// creating meta tags for our website
var meta = document.createElement('meta');
meta.authorname = "author";
meta.content = "Author: Jonathan Mader";
document.head.appendChild(meta);
var meta = document.createElement('meta');
meta.description = "description";
meta.content = "This website shows the nearest bus stop(s) with their relevant information given from either the users location, an input point via geojson, the given standard point, or an uploaded geojson point" +
  "aswell as a map showing either all bus stops with given information depending in popup with marker depending on the used point or just the bus stops inside a drawn polygon as bbox";
document.head.appendChild(meta);

// creating a title for our website (and displaying it with alert pop up)
document.title = "This is Assignement 4 for Geosoftware 1 by Jonathan Mader";
//alert(document.title);

// declaration of global variables
var pointcloud = [];
var standardPointArray = [];
var textAreaPointArray = [];
var uploadedPointArray = [];
var rectangle = [];
var drawnPolygonBusStops = [];
var point;
var givenpoint;
var uploadpoint;
var depatures;

/**
 * @function onLoad function that is executed when the page is loaded
 */
function onLoad() {

}

//##############################################################################
//## FUNCTIONS
//##############################################################################

/**
 * @function main the main function
 */
function main(point, pointcloud) {
  let resultarray = Distancecalculation.sortByDistance(point, pointcloud);
  // 1800 seconds for 30 minutes instead of 5 minutes (300 seconds) as said in the task because it makes more sense for the user (there are rqarely bus stops shown for 5 minutes)
  bushaltestellen.abfahrtenZwei(resultarray[1].id, 1800);
  bushaltestellen.abfahrten(resultarray[0].id, 1800);

  Tablestructure.tableClearer('allBusStopsTable');
  Tablestructure.drawAllBusStopsTable(resultarray);
  Tablestructure.nearestStopTableHeader(resultarray[0].name);
  Tablestructure.secondNearestStopTableHeader(resultarray[1].name);
}

/** 
 * This class contains all methods that are used to communicate and get the data from the given API 
 * and the default constructor for creating objects
 * @class
 */
class BusRadarAPI {
  /**
   * haltestellen
   * @public
   * @desc method fetches the wanted information from the API
   * about the busstops from it and then uses this data to fill the pointcloud array
   * and calling the main method with the new data
   */
  async haltestellen() {
    const API_URL = "https://rest.busradar.conterra.de/prod";
    const response = await fetch(API_URL + `/haltestellen`);
    const data = await response.json();
    pointcloud = data;
    main(point, pointcloud);
  }

  /**
   * abfahrten
   * @public
   * @desc this method is called when the nearest busstops got calculated
   * and uses the id of it to get the upcoming depatures
   * @param id busstop id from the API
   * @param time in seconds from the current timestamp
   */
  async abfahrten(id, time) {
    let resource = `https://rest.busradar.conterra.de/prod/haltestellen/${id}/abfahrten?sekunden=`;
    resource += time;
    const response = await fetch(resource);
    const data = await response.json();
    depatures = data;
    Tablestructure.drawNearestStopTable(depatures);
  }
  /**
   * abfahrtenZwei
   * @public
   * @desc this method is called when the nearest busstops got calculated, uses the id of it
   * to get the upcoming depatures
   * @param id busstop id from the API
   * @param time in seconds from the current timestamp
   */
  async abfahrtenZwei(id, time) {
    let resource = `https://rest.busradar.conterra.de/prod/haltestellen/${id}/abfahrten?sekunden=`;
    resource += time;
    const response = await fetch(resource);
    const dataZwei = await response.json();
    depatures = dataZwei;
    Tablestructure.drawSecondNearestStopTable(depatures);
  }
  /**
   * secondsToTime
   * @desc converts the given time in seconds by the API to ISO 8601
   * here as YYYY:MM:DD:T:hh:mm:ss
   * @meme https://www.reddit.com/r/ProgrammerHumor/comments/ukk563/the_start_of_time/
   * @source https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
   * @param seconds time in seconds
   */
  static secondsToTime(seconds) {
    var ms = seconds * 1000 + (60000 * 120);
    var date = new Date(ms)
    var time = date.toISOString().slice(0, -5);
    return time;
  }
}

/**
 * Class for building the tablestructure as seen on the website
 * @class
 */
class Tablestructure {

  /**
   * nearestStopTableHeader
   * @desc creates and updates the header for the first table, for comparing the direction to the 
   * direction of the allBusStopsTable so the user knows which stop goes in which direction
   * @param {*} nextBusStop
   */
  static nearestStopTableHeader(nextBusStop) {
    let message = "departures from the nearest stop " + nextBusStop + " in the next 30 minutes";
    document.getElementById("nearestStopTableHeader").innerHTML = message;
  }

  /**
   * drawNearestStopTable
   * @desc draws the table for the nearest bus stop containg the linienid as number
   * the direction as end stop and the actual depature time with date and time as YY:MM:DD:T:hh:mm:ss
   * @param {*} resultarray array of JSON with contains
   */
  static drawNearestStopTable(resultarray) {
    var table = document.getElementById("nearestStopTable");
    if (resultarray.length >= 0) {
      Tablestructure.tableClearer("nearestStopTable");
    }
    for (var j = 0; j < resultarray.length; j++) {
      var newRow = table.insertRow(j + 1);
      var cel1 = newRow.insertCell(0);
      var cel2 = newRow.insertCell(1);
      var cel3 = newRow.insertCell(2);
      cel1.innerHTML = resultarray[j].linienid;
      cel2.innerHTML = resultarray[j].richtungstext;
      cel3.innerHTML = BusRadarAPI.secondsToTime(resultarray[j].tatsaechliche_abfahrtszeit);
    }
    if (resultarray.length === 0) {
      let message = "no upcoming depatures from the nearest stop in the next 30 minutes!";
      document.getElementById("nearestStopTableHeader").innerHTML = message;
    }
  }

  /**
   * secondNearestStopTableHeader
   * @desc creates and updates the header for the second table, for comparing the direction to the 
   * direction of the allBusStopsTable so the user knows which stop goes in which direction
   * @param {*} secondNextBusStop
   */
  static secondNearestStopTableHeader(secondNextBusStop) {
    let message = "departures from the second nearest stop " + secondNextBusStop + " in the next 30 minutes";
    document.getElementById("secondNearestStopTableHeader").innerHTML = message;
  }

  /**
   * drawSecondNearestStopTable
   * @desc draws the table for the second nearest bus stop containg the linienid as number
   * the direction as end stop and the actual depature time with date and time as YY:MM:DD:T:hh:mm:ss 
   * @param {*} resultarray array of JSON with contains
   */
  static drawSecondNearestStopTable(resultarray) {
    var table = document.getElementById("secondNearestStopTable");
    if (resultarray.length >= 0) {
      Tablestructure.tableClearer("secondNearestStopTable");
    }
    for (var j = 0; j < resultarray.length; j++) {
      var newRow = table.insertRow(j + 1);
      var cel1 = newRow.insertCell(0);
      var cel2 = newRow.insertCell(1);
      var cel3 = newRow.insertCell(2);
      cel1.innerHTML = resultarray[j].linienid;
      cel2.innerHTML = resultarray[j].richtungstext;
      cel3.innerHTML = BusRadarAPI.secondsToTime(resultarray[j].tatsaechliche_abfahrtszeit);
    }
    if (resultarray.length === 0) {
      let message = "no upcoming depatures from the second nearest stop in the next 30 minutes!";
      document.getElementById("secondNearestStopTableHeader").innerHTML = message;
    }
  }
  /**
   * drawAllBusStopsTable
   * @desc draws the table for the nearest 35 bus stops from the given point by the user in ascending order and additional information 
   * about the name of the bus stop, its coordinates and the direction as text
   * @param {*} resultarray array of JSON with contains
   */
  static drawAllBusStopsTable(resultarray) {
    var table = document.getElementById("allBusStopsTable");
    //creates the Table with the direction an distances
    for (var j = 0; j < 15; j++) {
      var newRow = table.insertRow(j + 1);
      var cel1 = newRow.insertCell(0);
      var cel2 = newRow.insertCell(1);
      var cel3 = newRow.insertCell(2);
      var cel4 = newRow.insertCell(3);
      cel1.innerHTML = resultarray[j].name;
      cel2.innerHTML = resultarray[j].distance;
      cel3.innerHTML = resultarray[j].richtung;
      cel4.innerHTML = resultarray[j].coordinates;
    }
  }
  // drawing map markers with pop up and wanted information
  static drawAllMapMarkers(resultarray) {
    for (var i = 0; i < resultarray.length; i++) {
      let marker = new L.marker([resultarray[i].coordinates[1], resultarray[i].coordinates[0]], {
        icon: BusStopIcon
      }).addTo(map);
      // used point defaults to standard point here
      marker.bindPopup("Bus stop name: " + resultarray[i].name + "<br> Distance to used Point: " + resultarray[i].distance +
        "m <br> Direction: " + resultarray[i].richtung + "<br>Coordinates of bus stop: " + resultarray[i].coordinates, customOptionsBusStops)
    }
  }

  /**
   * tableClearer
   * @public
   * @desc deletes all rows to clear the table so they dont add up
   * @source refresh function from Beispiellösung 02 
   * @param tableID id of the table that we want to clear
   */
  static tableClearer(tableID) {
    //remove all table rows
    var tableHeaderRowCount = 1;
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount);
    }
  }
}

/** 
 * Class for calculating distances and sorting the distances in the resultarray
 */
class Distancecalculation {

  /**
   * toRadians
   * @public
   * @desc helping function, takes degrees and converts them to radians
   * @returns a radian value
   */
  static toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
  }

  /**
   * twoPointDistance
   * @public
   * @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
   * @param start array of [lon, lat] coordinates
   * @param end array of [lon, lat] coordinates
   * @returns the distance between 2 points on the surface of a sphere with earth's radius
   */
  static twoPointDistance(start, end) {
    //variable declarations
    var earthRadius; //the earth radius in meters
    var phi1;
    var phi2;
    var deltaLat;
    var deltaLong;

    var a;
    var c;
    var distance; //the distance in meters

    //function body
    earthRadius = 6371e3; //Radius
    phi1 = this.toRadians(start[1]); //latitude at starting point. in radians.
    phi2 = this.toRadians(end[1]); //latitude at end-point. in radians.
    deltaLat = this.toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
    deltaLong = this.toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

    a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = earthRadius * c;

    return distance;
  }

  /**
   * sortByDistance
   * @public
   * @desc takes a point and an array of points and sorts them by distance ascending
   * @param point array of [lon, lat] coordinates
   * @param pointArray array of points to compare to
   * @returns Array with JSON Objects, which contain coordinate and distance
   */
  static sortByDistance(point, pointArray) {
    let output = [];

    for (let i = 0; i < pointArray.features.length; i++) {
      let distance = Distancecalculation.twoPointDistance(point, pointArray.features[i].geometry.coordinates);
      let j = 0;
      // makes sure the given point is used
      while (j < output.length && distance > output[j].distance) {
        j++;
      }
      let newPoint = {
        // name of the busstop
        name: pointArray.features[i].properties.lbez,
        // coordinates of the busstop
        coordinates: pointArray.features[i].geometry.coordinates,
        // distance from given point to the bussstops
        distance: distance.toFixed(2),
        // direction the bus is depaturing to from the bus stops
        richtung: pointArray.features[i].properties.richtung,
        // id of the busstops, not displayed but used for the abfahrten method 
        id: pointArray.features[i].properties.nr,
      };
      output.splice(j, 0, newPoint);
    }
    return output;
  }
}

/** Class used to validate, transform and construct GeoJSON 
 * @class
 */
class GeoJSON {

  /**
   * validGeoJSONPoint
   * @public
   * @desc funtion that validates the input GeoJSON so it's only a point
   * @param geoJSON the input JSON that is to be validated
   * @returns boolean true if okay, false if not
   */
  static validGeoJSONPoint(geoJSON) {
    if (geoJSON.features.length == 1 &&
      geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
    ) {
      return true;
    } else {
      return false;
    }
  }
}
/**
 * Class containing the needed methods for the user to interact with the website 
 * and to show him the wanted information
 */
class Frontendfunctions {

  /**
   * useStandard
   * @public
   * @desc uses the standard point from the point.js as point and calls the main function with it
   */
  static standardPoint() {
    let standardPointArray = Distancecalculation.sortByDistance(point, pointcloud);
    main(point, pointcloud)
    Tablestructure.drawAllMapMarkers(standardPointArray);
    var lat = point[1];
    var lng = point[0];
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("Standard Point: <br>" + lat + ", " + lng, customPoint);
    marker.openPopup();;
    map.setView([lat, lng], 16);

  }

  /**
   * textareaInputPoint
   * @public
   * @desc textarea input gets read and is stored as GeoJSON object-type "Point", then calls main method with the new point
   */
  static textareaInputPoint() {
    document.getElementById("errorforinput").innerHTML = ""
    let positionGeoJSON = document.getElementById("userPosition").value;

    try {
      positionGeoJSON = JSON.parse(positionGeoJSON);
      //check validity of the geoJSON. it can only be a point
      if (GeoJSON.validGeoJSONPoint(positionGeoJSON)) {
        givenpoint = positionGeoJSON.features[0].geometry.coordinates;
        let textAreaPointArray = Distancecalculation.sortByDistance(givenpoint, pointcloud);
        main(givenpoint, pointcloud);
        Tablestructure.drawAllMapMarkers(textAreaPointArray);
      } else {
        document.getElementById("errorforinput").innerHTML = "Failed, no valid FeatureCollection with a single Point as text input found"
        alert("Failed! Try again!")
      }
    } catch (error) {
      document.getElementById("errorforinput").innerHTML = "Failed, no valid GeoJSON text input found"
      alert("Failed! Try again!")
      console.log(error);
    }
    var lat = positionGeoJSON.features[0].geometry.coordinates[1];
    var lng = positionGeoJSON.features[0].geometry.coordinates[0];
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("Textarea Point: <br>" + lat + ", " + lng, customPoint);
    marker.openPopup();;
    map.setView([lat, lng], 16);
  }

  /**
   * uploadedPoint 
   * @public
   * @desc calculates the distance from the uploaded point when it is a "Point" object in valid geojson 
   * by replacing the point with the given point from the uploaded file and calling the main method with it
   */
  static uploadedPoint() {
    document.getElementById("errorforupload").innerHTML = ""
    let uploadedGeoJSON = reader.result;
    try {
      uploadedGeoJSON = JSON.parse(uploadedGeoJSON);
      //check validity of the geoJSON. it can only be a point
      if (GeoJSON.validGeoJSONPoint(uploadedGeoJSON)) {
        uploadpoint = uploadedGeoJSON.features[0].geometry.coordinates;
        let uploadedPointArray = Distancecalculation.sortByDistance(uploadpoint, pointcloud);
        main(uploadpoint, pointcloud);
        Tablestructure.drawAllMapMarkers(uploadedPointArray);
      } else {
        document.getElementById("errorforupload").innerHTML = "Failed, no valid FeatureCollection with a single Point found"
        alert("Failed! Try again!")
      }
    } catch (error) {
      document.getElementById("errorforupload").innerHTML = "Failed, no valid GeoJSON document found"
      console.log(error);
      alert("Failed! Try again!")
    }
    var lat = uploadedGeoJSON.features[0].geometry.coordinates[1];
    var lng = uploadedGeoJSON.features[0].geometry.coordinates[0];
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup("Your uploaded Point: <br>" + lat + ", " + lng, customPoint);
    marker.openPopup();;
    map.setView([lat, lng], 16);
  }
}

// creating upload button to use on html website
let uploadbutton = document.getElementById("uploadbutton")
// creating reader variable for reading the given file
var reader
// reads the by the user uploaded .json or .geojson file 
uploadbutton.addEventListener('change', function () {
  if (uploadbutton.isDefaultNamespace.length > 0) {
    reader = new FileReader()
    reader.readAsText(uploadbutton.files[0])
  }
})

/** 
 * Class containing all static methods for getting the user position 
 * @class
 */
class Positioning {

  /**
   * getLocation
   * @public
   * @desc function to get the location of the user
   * @source https://www.w3schools.com/html/html5_geolocation.asp
   */
  static getLocation() {
    var x = document.getElementById("userPosition");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
      navigator.geolocation.getCurrentPosition(displayLocation);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  /**
   * showPosition
   * @public
   * @desc Shows the position of the user in the textarea.
   * @param position Json object of the user
   */
  static showPosition(position) {
    var x = document.getElementById("userPosition");
    // "Skeleton" of a valid geoJSON Feature collection
    let outJSON = {
      "type": "FeatureCollection",
      "features": []
    };
    // skelly of a (point)feature
    let pointFeature = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": []
      }
    };

    pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];

    // add the coordinates to the GeoJSON
    outJSON.features.push(pointFeature);
    x.innerHTML = JSON.stringify(outJSON);

  }

  /**
   * showError 
   * @public
   * @desc gives out error if location could not be determined
   * @param error 
   * @source https://www.w3schools.com/html/html5_geolocation.asp
   */
  static showError(error) {
    var x = document.getElementById("userPosition");
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.")
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.")
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.")
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.")
        break;
    }
  }
}

//##############################################################################
//## LEAFLET
//##############################################################################

// Creating a leaflet map centered to Münster and with OSM as basemap
var map = new L.Map('busStopMap', {
  center: new L.LatLng(51.9606649, 7.6261347),
  zoom: 13
});
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/**
 * displayLocation
 * @desc shows the position of the user on the leaflet map as marker with popup to give the user information about the coordinates of his location
 * @param position location of the user given by getLocation() 
 * @return a marker with popup on the leaflet map
 */
function displayLocation(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  var marker = L.marker([lat, lng]).addTo(map);
  marker.bindPopup("Your current position: " + lat + " " + lng, customPoint);
  marker.openPopup();;
  map.setView([lat, lng], 16);
}

// styling for the icon for the bus stops
var BusStopIcon = L.icon({
  iconUrl: 'src/busstop.png',
  iconSize: [25, 25], // size of the icon
  iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
  popupAnchor: [13, 0] // point from which the popup should open relative to the iconAnchor
});

// specify popup options 
var customOptionsBusStops = {
  'maxWidth': '500',
  'className': 'custom'
}
var customPoint = {
  'maxWidth': '500',
  'className': 'custom2'
}

//drawcontrol variables
var drawnItems = new L.FeatureGroup()
var drawControl = new L.Control.Draw({
  draw: {
    polygon: false,
    marker: false,
    circle: false,
    polyline: false,
    circlemarker: false
  },
  edit: {
    featureGroup: drawnItems
  }
})

// adding drawControl
map.addLayer(drawnItems)
map.addControl(drawControl)


// adding the drawn rectangle to map via event
map.on(L.Draw.Event.CREATED, (e) => {
  var type = e.layerType;
  var layer = e.layer;
  rectangle = layer.toGeoJSON().geometry.coordinates;
  drawnItems.addLayer(layer);
  map.addLayer(layer);

  // calculating distances to default point and getting the information wanted for the pop ups
  var drawnPolygonBusStops = Distancecalculation.sortByDistance(point, pointcloud);

  for (var i = 0; i < drawnPolygonBusStops.length; i++) {

    var poly = turf.polygon(rectangle);
    var pt = turf.point(drawnPolygonBusStops[i].coordinates);

    // checking if the coodinates from the bus stops from the array are inside the drawn polygon with turf.booleanPointInPolygon
    turf.booleanPointInPolygon(pt, poly)
    if (turf.booleanPointInPolygon(pt, poly) == true) {
      let marker = new L.marker([drawnPolygonBusStops[i].coordinates[1], drawnPolygonBusStops[i].coordinates[0]], {
        icon: BusStopIcon
      }).addTo(map)

      marker.bindPopup("Bus stop name: " + drawnPolygonBusStops[i].name + "<br> Distance to used Point: " + drawnPolygonBusStops[i].distance +
        "<br> Direction: " + drawnPolygonBusStops[i].richtung + "<br>Coordinates of bus stop: " + drawnPolygonBusStops[i].coordinates, customOptionsBusStops)

      
    }
  }
})

//##############################################################################
//## OBJECTS
//##############################################################################
const bushaltestellen = new BusRadarAPI();
bushaltestellen.haltestellen();
