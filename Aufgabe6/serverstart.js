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


var ObjectId = require('mongodb').ObjectID;

/*
This part sadly isn't working out for us, we did not get it work that leaflet is loaded over the node-modules and not over an external CDN
We followed this: https://github.com/ryerson-ggl/tutorial-express-leaflet
And used this: https://stackoverflow.com/a/56851064/18894154
// Create globals so leaflet can load
global.window = { screen: {} }
global.document = {
  documentElement: { style: {} },
  getElementsByTagName: () => { return [] },
  createElement: () => { return {} }
}
global.navigator = { userAgent: 'nodejs', platform: 'nodejs' }

const L = require('leaflet')
*/
const mongodb = require('mongodb');
const express = require('express');
let bodyParser = require('body-parser');

const app = express()
const port = 5000;

/**
 * @function to connect to the mongoDB database
 */

(async () => {

  try {
    // connecting to mongodb via standard port 27017
    app.locals.dbConnection = await mongodb.MongoClient.connect('mongodb://localhost:27017', {
      useNewUrlParser: true
    });
    // defining what collection to use (here: locations, which will automatically be created by mongoDB and can be inspected locally via MongoDBCompass)
    app.locals.db = await app.locals.dbConnection.db('locations');
    console.log('Using db: ' + app.locals.db.databaseName);
  } catch (error) {
    console.dir(error);
    setTimeout(connectMongoDB, 5000);
  }

})();


app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'));
app.use('/leaflet-draw', express.static(__dirname + '/node_modules/leaflet-draw/dist'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/save-input', bodyParser.json());
app.use('/delete-input', bodyParser.json());
app.use('/update-input', bodyParser.json());
app.use('/item', bodyParser.json());


// sending busInformationPage to / to be the main index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/busInformationPage.html');
});

// sending locationcreator to be the linked index
app.get('/locationcreator.html', (req, res) => {
  res.sendFile(__dirname + '/locationcreator.html');
});

// handler for getting items
app.get('/item', (req, res) => {
  // Search for all stored items in the mongoDB 
  app.locals.db.collection('items').find({}).toArray((error, result) => {
    if (error) {
      console.dir(error);
    }
    res.json(result);
  });
});

// adding data to the given database
app.post('/save-input', (req, res) => {
  console.log('POST', req.body);
  app.locals.db.collection('items').insertOne(req.body);
});

// deleting ddata to the given database
app.delete('/delete-input', (req, res) => {
  app.locals.db.collection('items').deleteOne({
    '_id': ObjectId(req.body._id)
  });
});

// updating data stored in the given database
app.put('/update-input', (req, res) => {
  app.locals.db.collection('items').updateOne({
    '_id': ObjectId(req.body._id)
  }, {
    $set: {
      ['geometry.coordinates']: [req.body.geometry.coordinates]
    }
  });
});

// listen on port 5000
app.listen(port,
  () => console.log(`Example app
      listening at http://localhost:${port}`));