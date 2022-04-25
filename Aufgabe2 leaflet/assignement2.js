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
document.title = "This is Assignement 2 for Geosoftware 1 by Jonathan Mader with an additional leaflet visualization ;)";
alert(document.title);

// creating an array to store the calculated distances in
var distances = new Array();

/**
 *@function deg2rad 
 *@desc arrow function for converting degree to radian
 *@param {double} degree
 *@returns {double} radian
 */
let deg2rad = (deg) => deg * (Math.PI / 180);
/**
 * @function distanceinmeter 
 * @desc calculates the distance between two points and stores the values in the distances array
 * @param {JSONConstructor} coord1 is the first set of coordinates given by the choosen point used
 * @param {double} poi is the second set of coordinates given by poi array

 */
function distanceinmeter(coord1, coord2) {
    for (var i = 0; i < 16; i++) {
        var lat1 = coord1.coordinates[1];
        var lon1 = coord1.coordinates[0];
        var lon2 = pois.features[i].geometry.coordinates[0]; // Allocation of longitude of the poi.js
        var lat2 = pois.features[i].geometry.coordinates[1]; // Allocation of latitude of the poi.js

        const R = 6371e3; // metres
        const phi1 = deg2rad(lat1);
        const phi2 = deg2rad(lat2);
        const deltaphi = deg2rad(lat2 - lat1)
        const deltalamda = deg2rad(lon2 - lon1)

        const a = Math.sin(deltaphi / 2) * Math.sin(deltaphi / 2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(deltalamda / 2) * Math.sin(deltalamda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c
        distances[i] = d.toFixed(1);

    }
    //Sorting the distances array numeric
    //Source: https://www.w3schools.com/js/js_array_sort.asp
    distances.sort(function (a, b) {
        return a - b
    });
}

// allocating the stored location to an id for error message
var x = document.getElementById("position");
/**
 * @function getLocation 
 * @desc function to get the location of the user
 * @source https://www.w3schools.com/html/html5_geolocation.asp
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(insertPosition, showError);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}
/**
 * @function  insertPosition 
 * @desc function to convert the coordinates of the position of the user to a GeoJSON point and insert it into the textarea
 * @param position coordinates of the user
 */
function insertPosition(position) {
    let location = new Array(position.coords.longitude, position.coords.latitude)
    location = new JSONConstructor(location, "Point")
    document.getElementById("location").innerHTML = JSON.stringify(location)
}
/**
 * @function  showError 
 * @desc function to give out error if location could not be determined
 * @param error 
 * @source https://www.w3schools.com/html/html5_geolocation.asp
 */
function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "User denied the request for Geolocation."
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "Location information is unavailable."
            break;
        case error.TIMEOUT:
            x.innerHTML = "The request to get user location timed out."
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "An unknown error occurred."
            break;
    }
}

/**
 * @function clearTable
 * @desc deletes all rows to clear the table so they dont add up
 */
function clearTable() {
    var t = document.getElementById("table")
    var childCounter = t.childElementCount

    for (var i = 0; i < childCounter; i++) {
        t.removeChild(t.lastChild) // removes children
    }
}

/**
 * @function isvalid
 * @desc checks whether the given string is a valid stringified JSON
 * @param {string} string stringified JSON
 * @throws error, if a not strigified JSON string is detected
 */
function isValid(string) {
    try {
        JSON.parse(string);
    } catch (error) {
        return false;
    }
    return true;
}
/**
 * @function JSONConstructor
 * @desc builds a JSON object 
 * @param {[[coordinates],[coordinates],..,[coordinates]]} array array for transformation
 * @param {string} type given GeoJSON object-type
 * @source https://www.w3schools.com/js/js_object_constructors.asp
 */
function JSONConstructor(array, type) {
    this.type = type
    this.coordinates = array
}
// This variable stores the point which is given by the user via upload or text-input to calculate the distance to the pois 
var givenpoint
/**
 * @function getInputValue
 * @desc textarea input get read and is stored as GeoJSON object-type "Point", then calls main method with the new point
 */
function getInputValue() {
    document.getElementById("errorforinput").innerHTML = ""
    if (isValid(document.getElementById("location").value) == true) { // Checks whether the location is valid
        if ((JSON.parse(document.getElementById("location").value)).type != "Point") {
            document.getElementById("errorforinput").innerHTML = 'Failed, geometry type is not Point. Expected pattern: {"type":"Point","coordinates":[...]}'
        } else {
            givenpoint = JSON.parse(document.getElementById("location").value)
            main(givenpoint)
        }
    } else { // Throws an error if not
        document.getElementById("errorforinput").innerHTML = "Failed, no valid GeoJSON found"
    }
}
/**
 * @function useStandard
 * @desc uses the standard point from the point.js as point and calls the main function with it
 */
function useStandard() {
    givenpoint = point
    main(givenpoint)
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
 * @function getFile 
 * @desc calculates the distance from the uploaded point when it is a "Point" object in valid geojson 
 * by replacing the point with the given point from the uploaded file and calling the main method with it
 */
function getFile() {
    document.getElementById("errorforupload").innerHTML = ""
    if (isValid(reader.result) == true) { // Checks whether the input is valid
        if ((JSON.parse(reader.result)).type != "Point") {
            document.getElementById("errorforupload").innerHTML = 'Failed, geometry type is not Point. Expected pattern: {"type":"Point","coordinates":[...]}'
        } else {
            givenpoint = JSON.parse(reader.result)
            main(givenpoint)
        }
    } else { // Throws an error if not
        document.getElementById("errorforupload").innerHTML = "Failed, no valid GeoJSON found"
    }
}

// building up new objects to transform the given arrays to JSON
point = new JSONConstructor(point, "Point")
givenpoint = point

/**
 * @function main the main function
 * @param pointsforcalc given point by the user for calculating the distance between it and the set of pois
 * @desc calls the distanceinmeter functions, fills the table with the calculated values of the distances array and clears the table if needed
 */
function main(pointsforcalc) {
    distanceinmeter(pointsforcalc, pois);
    clearTable();
    // building table for the HTML-webpage
    const table = document.getElementById("table")
    const hrow = document.createElement("tr")
    table.appendChild(hrow)

    var listCaptions = [" Distance (in meter) "]
    // Now the first line with the headings gets build up 
    for (let caption of listCaptions) {
        const th = document.createElement("th")
        const thtext = document.createTextNode(caption)
        th.appendChild(thtext)
        hrow.appendChild(th)
    }

    // Now the table gets filled up with all the values from the relevant-data-array
    for (let distance of distances) {
        const drow = document.createElement("tr")
        table.appendChild(drow)

        let elements = distance
        const td = document.createElement("td")
        const thtext = document.createTextNode(elements)
        td.appendChild(thtext)
        drow.appendChild(td)
    }
}