// Author: Jonathan Mader
// This script calculates the distances between a given point from the point.js and the cities given as points in cities.js via latitude and longitude using the haversine formular and then allocates these distances to data variables to fill a HTML table with them

"use strict" 

// Function to convert from degree to Rad for more accurate calculation
function degToRad(deg) {
    return deg * (Math.PI/180);  //conversion formula: 1° × π/180 = 0,01745 rad
  }

/**
 * Function to calculate the shortest distance on the earth using the haversine formula.
 * Link: http://www.movable-type.co.uk/scripts/latlong.html
 * @param {[float,float]} point1 coordinates [lng/lat] 
 * @param {[float,float]} point2 coordinates [lng/lat] 
 * @returns shortest distance between the two points in kilometers.
 */
 function distanceInkmMeter(point1,point2) {
    var earthRadius = 6371; // Radius of the earth in km
    var distanceLongitude = degToRad(point2[0]- point1[0]); // Distance on the longitude in rad
    var distanceLatitude = degToRad(point2[1]- point1[1]);  // Distance on the latitude in rad

    var a = 
      Math.sin(distanceLatitude/2) * Math.sin(distanceLatitude/2) +
      Math.cos(degToRad(point1[1])) * Math.cos(degToRad(point2[1])) * 
      Math.sin(distanceLongitude/2) * Math.sin(distanceLongitude/2)
      ; //a is the square of half the chord length between the points
    
      var distanceRad = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); // Distance in rad
   
      var distanceKM = earthRadius * distanceRad; // Distance in km
    
      return distanceKM;
  }

// constants because the points are set via point.js and cities.js and do not change
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
var distcologne = distanceInkmMeter(point, cologne);
var distamsterdam = distanceInkmMeter(point, amsterdam);
var distkassel = distanceInkmMeter(point, kassel);
var distbarcelona = distanceInkmMeter(point, barcelona);
var disttunis = distanceInkmMeter(point, tunis)
var distkyoto = distanceInkmMeter(point, kyoto)
var distbucharest = distanceInkmMeter(point, bucharest)
var distgraz = distanceInkmMeter(point, graz)
var distkairo = distanceInkmMeter(point, kairo)
var distdublin = distanceInkmMeter(point, dublin)
var distoslo = distanceInkmMeter(point, oslo)

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

