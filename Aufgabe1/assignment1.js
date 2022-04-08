// Author: Jonathan Mader
// This script calculates the distances between a given point from the point.js and the cities given as points in cities.js via latitude and longitude using the haversine formular and then allocates these distances to data variables to fill a HTML table with them

"use strict" 

/**
 * Function to convert degree coordinates into radian coordinates
 * formula: degree * π/180 = rad
 * @param {[float]} degrees coordinates (degrees)
 * @returns converted coordinates in radian
 */
 function degtorad(degrees)
 {
   return degrees * (Math.PI/180);
 }

/**
 * Function for calculating the shortest distance between two points given in coordinates on the earth with the haversine formula.
 * Link: http://www.movable-type.co.uk/scripts/latlong.html
 * Used functions: degtorad(degrees)
 * @param {[float,float]} point1 coordinates [lng/lat] 
 * @param {[float,float]} point2 coordinates [lng/lat] 
 * @returns shortest distance between the two given points in kilometers.
 */
 function distanceInkilometer(point1,point2) {
    const R = 6371; // Radius of the earth in km
    const distLongitude = degtorad(point2[0]- point1[0]); // Distance on the longitude in rad
    const distLatitude = degtorad(point2[1]- point1[1]);  // Distance on the latitude in rad

    const a =   Math.sin(distLatitude/2) * Math.sin(distLatitude/2) +
                Math.cos(degtorad(point1[1])) * Math.cos(degtorad(point2[1])) * 
                Math.sin(distLongitude/2) * Math.sin(distLongitude/2); // a equals square of half the chord length between the points
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); // Distance in rad
   
    const distanceinKM = R * c; // Distance in km
    
    return distanceinKM;
  }
  
// constants (because the points are set via point.js and cities.js and do not change)
const start = point;
const cologne = cities[0];
const amsterdam = cities[1];
const kassel = cities[2];
const barcelona = cities[3];
const tunis = cities[4];
const kyoto = cities[5];
const bucharest = cities[6];
const graz = cities[7];
const kairo = cities[8];
const dublin = cities[9];
const oslo = cities[10];

// calculation of the distances from each city to the point
var distcologne = distanceInkilometer(point, cologne);
var distamsterdam = distanceInkilometer(point, amsterdam);
var distkassel = distanceInkilometer(point, kassel);
var distbarcelona = distanceInkilometer(point, barcelona);
var disttunis = distanceInkilometer(point, tunis)
var distkyoto = distanceInkilometer(point, kyoto)
var distbucharest = distanceInkilometer(point, bucharest)
var distgraz = distanceInkilometer(point, graz)
var distkairo = distanceInkilometer(point, kairo)
var distdublin = distanceInkilometer(point, dublin)
var distoslo = distanceInkilometer(point, oslo)


// allocation of the distanced to data variables 
var data1 = distcologne.toFixed(2);
var data2 = distamsterdam.toFixed(2);
var data3 = distkassel.toFixed(2);
var data4 = distbarcelona.toFixed(2);
var data5 = disttunis.toFixed(2);
var data6 = distkyoto.toFixed(2);
var data7 = distbucharest.toFixed(2);
var data8 = distgraz.toFixed(2);
var data9 = distkairo.toFixed(2);
var data10 = distdublin.toFixed(2);
var data11 = distoslo.toFixed(2);


// getElementById for filling the HTML table with the calculated distances
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

