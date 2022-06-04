/**
 * Aufgabe 2, Geosoft 1, SoSe 2022
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
meta.content = "This website is for calculating points from a choosen point to given point of interests";
document.head.appendChild(meta);

// creating a title for our website and displaying it with alert pop up
document.title = "This is Assignement 2 for Geosoftware 1 by Jonathan Mader";
//alert(document.title);

//declaration of global variables
var pointcloud;
var point;
var givenpoint;
var uploadpoint;


/**
 * @function onLoad function that is executed when the page is loaded
 */
function onLoad() {
  //event listener
  document.getElementById("getLocationBtn").addEventListener("click",
    () => {
      var x = document.getElementById("userPosition");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    }
  );
  //daten vorbereiten und main ausführen
  pois = JSON.parse(pois);
  main(point, pointcloud);
}

//##############################################################################
//## FUNCTIONS
//##############################################################################

/**
 * @function main the main function
 */
function main(point, pointcloud) {
  //sortiere Daten nach distanz und mach damit eine Tabelle auf der HTML
  let results = sortByDistance(point, pois);
  Tablestructure.clearTable("resultTable")
  Tablestructure.drawTable(results);

}

/**
 * @function sortByDistance
 * @desc takes a point and an array of points and sorts them by distance ascending
 * @param point array of [lon, lat] coordinates
 * @param pointArray array of points to compare to
 * @returns Array with JSON Objects, which contain coordinate and distance
 */
function sortByDistance(point, pointArray) {
  let output = [];

  for (let i = 0; i < pointArray.features.length; i++) {
    let distance = twoPointDistance(point, pointArray.features[i].geometry.coordinates);
    let j = 0;
    //Searches for the Place
    while (j < output.length && distance > output[j].distance) {
      j++;
    }
    let newPoint = {
      coordinates: pointArray.features[i].geometry.coordinates,
      distance: distance.toFixed(2),
      name: pointArray.features[i].properties.name
    };
    output.splice(j, 0, newPoint);
  }

  return output;
}

/**
 * @function twoPointDistance
 * @desc takes two geographic points and returns the distance between them. Uses the Haversine formula (http://www.movable-type.co.uk/scripts/latlong.html, https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula)
 * @param start array of [lon, lat] coordinates
 * @param end array of [lon, lat] coordinates
 * @returns the distance between 2 points on the surface of a sphere with earth's radius
 */
function twoPointDistance(start, end) {
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
  phi1 = toRadians(start[1]); //latitude at starting point. in radians.
  phi2 = toRadians(end[1]); //latitude at end-point. in radians.
  deltaLat = toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
  deltaLong = toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

  a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
  c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  distance = earthRadius * c;

  return distance;
}

/**
 * @function validGeoJSONPoint
 * @desc funtion that validates the input GeoJSON so it's only a point
 * @param geoJSON the input JSON that is to be validated
 * @returns boolean true if okay, false if not
 */
function validGeoJSONPoint(geoJSON) {
  if (geoJSON.features.length == 1 &&
    geoJSON.features[0].geometry.type.toUpperCase() == "POINT"
  ) {
    return true;
  } else {
    return false;
  }
}

/**
 * @function toRadians
 * @desc helping function, takes degrees and converts them to radians
 * @returns a radian value
 */

let toRadians = (degrees) => degrees * (Math.PI / 180);

class Tablestructure {
  /**
   * @function drawTable
   * @desc inserts the calculated data into the table that's displayed on the page
   * @param {*} results array of JSON with contains
   */
  static drawTable(results) {
    var table = document.getElementById("resultTable");
    //creates the Table with the direction an distances
    for (var j = 0; j < results.length; j++) {
      var newRow = table.insertRow(j + 1);
      var cel1 = newRow.insertCell(0);
      var cel2 = newRow.insertCell(1);
      var cel3 = newRow.insertCell(2);
      cel1.innerHTML = results[j].coordinates;
      cel2.innerHTML = results[j].name;
      cel3.innerHTML = results[j].distance;
    }
  }

  /**
   * clearTable
   * @desc removes all table entries and rows except for the header.
   * @param tableID the id of the table to clear
   */
  static clearTable(tableID) {
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
 * @function arrayToGeoJSON
 * @desc function that converts a given array of points into a geoJSON feature collection.
 * @param inputArray Array that is to be converted
 * @returns JSON of a geoJSON feature collection
 */
function arrayToGeoJSON(inputArray) {
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = {
    "type": "FeatureCollection",
    "features": []
  };
  //skelly of a (point)feature
  let pointFeature = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": []
    }
  };

  //turn all the points in the array into proper features and append
  for (const element of inputArray) {
    let newFeature = pointFeature;
    newFeature.geometry.coordinates = element;
    outJSON.features.push(JSON.parse(JSON.stringify(newFeature)));
  }

  return outJSON;
}

/**
 * @function showPosition
 * @desc Shows the position of the user in the textares
 * @param {*} position Json object of the user
 */
function showPosition(position) {
  var x = document.getElementById("location");
  //"Skeleton" of a valid geoJSON Feature collection
  let outJSON = {
    "type": "FeatureCollection",
    "features": []
  };
  //skelly of a (point)feature
  let pointFeature = {
    "type": "Feature",
    "properties": {},
    "geometry": {
      "type": "Point",
      "coordinates": []
    }
  };
  pointFeature.geometry.coordinates = [position.coords.longitude, position.coords.latitude];
  //add the coordinates to the geoJson
  outJSON.features.push(pointFeature);
  x.innerHTML = JSON.stringify(outJSON);
}

class Frontendfunctions {
  /**
   * @function textareaInputPoint
   * @desc textarea input gets read and is stored as GeoJSON object-type "Point", then calls main method with the new point
   */
  static textareaInputPoint() {
    let positionGeoJSON = document.getElementById("location").value;

    try {
      positionGeoJSON = JSON.parse(positionGeoJSON);
      //check validity of the geoJSON. it can only be a point
      if (validGeoJSONPoint(positionGeoJSON)) {
        givenpoint = positionGeoJSON.features[0].geometry.coordinates;
        main(givenpoint, pointcloud);
      } else {
        alert("invalid input.please input a single valid point in a feature collection");
      }
    } catch (error) {
      console.log(error);
      alert("invalid input. see console for more info.");
    }
  }

  /**
   * @function useStandard
   * @desc uses the standard point from the point.js as point and calls the main function with it
   */
  static standardPoint() {
    main(point, pointcloud)
  }



  /**
   * @function uploadedPoint 
   * @desc calculates the distance from the uploaded point when it is a "Point" object in valid geojson 
   * by replacing the point with the given point from the uploaded file and calling the main method with it
   */
  static uploadedPoint() {
    let uploadedGeoJSON = reader.result;
    try {
      uploadedGeoJSON = JSON.parse(uploadedGeoJSON);
      //check validity of the geoJSON. it can only be a point
      if (validGeoJSONPoint(uploadedGeoJSON)) {
        uploadpoint = uploadedGeoJSON.features[0].geometry.coordinates;
        main(uploadpoint, pointcloud);
      } else {
        alert("invalid input.please input a single valid point in a feature collection");
      }
    } catch (error) {
      console.log(error);
      alert("invalid input. see console for more info.");
    }
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