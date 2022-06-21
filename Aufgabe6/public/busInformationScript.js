/**
 * Aufgabe 6, Geosoft 1, SoSe 2022
 * @author Jonathan Mader, matr.Nr.: 502644
 * @author Erkam Dogan, matr.Nr.: 508236
 * @author Kieran Galbraith, matr.Nr.: 453493
 */

//*various Linter configs*
// jshint esversion: 6
// jshint browser: true
// jshint node: true
// jshint -W097

var meta = document.createElement('meta');
meta.authorname = "author";
meta.content = "Authors: Jonathan Mader, Erkam Dogan, Kieran Galbraith";
document.head.appendChild(meta);
var meta = document.createElement('meta');
meta.description = "description";
meta.content = "This website shows the nearest bus stop(s) with their relevant information given from either the users location, an input point via the location creator and the connected database";
document.head.appendChild(meta);

// global variables
var pointcloud = [];
var inputLocation = [];


/**
 * function twoPointDistance
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
    phi1 = this.toRadians(start[1]); //latitude at starting point. in radians.
    phi2 = this.toRadians(end[1]); //latitude at end-point. in radians.
    deltaLat = this.toRadians(end[1] - start[1]); //difference in latitude at start- and end-point. in radians.
    deltaLong = this.toRadians(end[0] - start[0]); //difference in longitude at start- and end-point. in radians.

    a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    distance = (earthRadius * c) / 1000;

    return distance.toFixed(3);
}


/**
 * toRadians
 * @public
 * @desc helping function, takes degrees and converts them to radians
 * @returns a radian value
 */
function toRadians(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}


/**
 * @function timeConverter
 * @desc checks if there is a depature for the given time and if so it transforms it into the actual time in HH:MM:SS and then pushes it into the table
 * @source https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
 * @param depature from the abfahrten function, containts the needed timestamp
 */

var departureTimeResults;

function timeConverter(departure) {
    var popupResults = [];
    console.log(departure);
    // checks if busconnection is available
    if (departure.length < 1) {
        L.circle(popup, {})
            .addTo(basemap)
            .bindPopup("No depatures in the next 30 minutes").openPopup();
    }
    // if available, convert the given timestamp
    else {
        for (var i = 0; i < departure.length; i++) {
            var dt = new Date(departure[i].abfahrtszeit * 1000);
            var hr = dt.getHours();
            var m = "0" + dt.getMinutes();
            var s = "0" + dt.getSeconds();
            var time = hr + ':' + m.substr(-2) + ':' + s.substr(-2);
            var depatures = i + '. departure';
            var busdirection = i + '. Busdirection';
            var busnumber = i + '. Busnumber';

            popupResults.push([
                [time],
                [departure[i].linienid],
                [departure[i].richtungstext]
            ]);

        }
        departureTimeResults = popupResults;
        busLineInformation(departureTimeResults);
        popupResults.length = 0;

    }
}
/**
 * @function busLineInformation
 * @desc fills the table with the given information about the clicked bus stop and creates a heading for it with the name
 */

function busLineInformation(departureTimeResults) {
    document.getElementById("busstop").innerHTML = "<h3>" + nameOfBusStop + "</h3>";
    var resultTable = document.getElementById("resultTable");

    if (resultTable.rows.length > 0) {
        tableClearer();
    }

    for (var j = 0; j < departureTimeResults.length; j++) {
        var newRow = resultTable.insertRow(j + 1);
        var cel1 = newRow.insertCell(0);
        var cel2 = newRow.insertCell(1);
        var cel3 = newRow.insertCell(2);

        cel1.innerHTML = departureTimeResults[j][0];
        cel2.innerHTML = departureTimeResults[j][1];
        cel3.innerHTML = departureTimeResults[j][2];

    }

    departure.length = 0;
    departureTimeResults.length = 0;
    nameOfBusStop = '';
}

/**
 * function tableClearer
 * @desc deletes all rows to clear the table so they dont add up
 * @source refresh function from Beispiellösung 02 
 * @param tableID id of the table that we want to clear
 */
function tableClearer() {
    var tableHeaderRowCount = 1;
    var table = document.getElementById('resultTable');
    var rowCount = table.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount);
    }
}

/**
 * @function pushAndSort
 * @desc calls resultDistance function and pushes the calculations into the output Array and sorts it
 */

let output = [];

function pushAndSort() {

    var JSONinput = pointcloud.features;
    for (let i = 0; i < JSONinput.length; i++) {

        let resultDistance = twoPointDistance(inputLocation, pointcloud.features[i].geometry.coordinates);
        output.push([
            [resultDistance],
            [pointcloud.features[i].properties.lbez],
            [pointcloud.features[i].properties.nr],
            [pointcloud.features[i].properties.richtung],
            [pointcloud.features[i].geometry.coordinates]
        ]);

    }
    output.sort();
    output = output.slice(0, 5);
    tableFiller(output, departureTimeResults);
}

/**
 * @function tableFiller
 * @desc prints all results into a html table: busstop details of all busstops are displayed
 */

function tableFiller(output, departureTimeResults) {

    for (let j = 0; j < output.length; j++) {
        document.getElementById("distance" + j).innerHTML = output[j][0];
        document.getElementById("ID" + j).innerHTML = output[j][1];
        document.getElementById("direction" + j).innerHTML = output[j][3];
        document.getElementById("coordinates" + j).innerHTML = output[j][4];
    }
    output.length = 0;
}