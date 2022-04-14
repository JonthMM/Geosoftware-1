/**
* Geosoftware SS2022 Abgabe 1
* @author Jonathan Mader
* @version 1.0.0
*/

// This script is for calculating the distances between a given point from the point.js and the cities given as points in cities.js via latitude and longitude using the haversine formular and then allocates these distances to data variables to fill a HTML table with them
// Extra: This code is written rather for styling and appearance of the website and is not focused on dynamic aspects
"use strict"

var distancesinkm = new Array(); // Creating the array that is used to store the value of the distances

/**
 * This function uses the haversine formular to calculate the shortest distance in km on the earth "as the crow flies" between two points
 * Source: http://www.movable-type.co.uk/scripts/latlong.html
 * returns: const d and stores the values in the distanceinkm array
 */
function distanceinkm() {

    for(var i = 0; i < cities.length; i++){

        var lat1 = point[1]; // Allocation of latitude of the point.js
        var lon1 = point[0]; // Allocation of longitude of the point.js
        var lon2 = cities[i][0]; // Allocation of longitude of the cities.js
        var lat2 = cities[i][1]; // Allocation of latitude of the cities.js
    
        const R = 6371e3; // metres
        const phi1 = lat1 * Math.PI / 180;
        const phi2 = lat2 * Math.PI / 180;
        const deltaphi = (lat2-lat1) * Math.PI/180;
        const deltalamda = (lon2-lon1) * Math.PI/180;
    
        const a = Math.sin(deltaphi/2) * Math.sin(deltaphi/2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltalamda/2) * Math.sin(deltalamda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
        const d = R * c / 1000; // transformation to kilometres
    
        distancesinkm[i] = d; // storing the calculated distances of the cities.js in the given array
    }
    //Sorting the distancesinkm array numeric
    distancesinkm.sort(function(a, b){return a - b}); //Source: https://www.w3schools.com/js/js_array_sort.asp
}

// Executing the distanceinkm function to calculate the distances
distanceinkm();

// allocation of the distances calculated and stored in the array to data variables 
var data1 = distancesinkm[0].toFixed(2);
var data2 = distancesinkm[1].toFixed(2);
var data3 = distancesinkm[2].toFixed(2);
var data4 = distancesinkm[3].toFixed(2);
var data5 = distancesinkm[4].toFixed(2);
var data6 = distancesinkm[5].toFixed(2);
var data7 = distancesinkm[6].toFixed(2);
var data8 = distancesinkm[7].toFixed(2);
var data9 = distancesinkm[8].toFixed(2);
var data10 = distancesinkm[9].toFixed(2);
var data11 = distancesinkm[10].toFixed(2);


// using DOM (getElementById("id").innerHTML) for filling the HTML table with the calculated distances
document.getElementById("data1").innerHTML = data1;
document.getElementById("data2").innerHTML = data2;
document.getElementById("data3").innerHTML = data3;
document.getElementById("data4").innerHTML = data4;
document.getElementById("data5").innerHTML = data5;
document.getElementById("data6").innerHTML = data6;
document.getElementById("data7").innerHTML = data7;
document.getElementById("data8").innerHTML = data8;
document.getElementById("data9").innerHTML = data9;
document.getElementById("data10").innerHTML = data10;
document.getElementById("data11").innerHTML = data11;
