</strong></h1>Aufgabe6</strong></h1>

My files for the 6th Assignment of the Geosoftware 1 course

The first website gives information about the busstops in Münster and lets the user get information about the time of depature,
the busline and the direction of the bus from a choosen busstop that is clicked on on the map.
It also allows you to choose a location that is stored in the database and lets you get information about the
nearest busstops, that would be the distance in kilometers, the busstop name, the direction and the coordinates.

The other website is a location creator, where the user can input new locations either by setting a marker on the map via leaflet drawm
enter a adress which will get converted to GeoJSON via forward geocoding or by using the browser location. These locations can also be updated
or deleted when they are stored in the mongoDB.

<h2>What is needed?</h2>

For the forward geocoding you need a MapBox access Token at var access_token = "access Token"

You need to install express, mongodb, body-parser and jquery for the app to work
(npm install ...)