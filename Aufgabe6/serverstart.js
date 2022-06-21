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


var ObjectId = require('mongodb');
const mongodb = require('mongodb');
const express = require('express');
let bodyParser = require('body-parser');

const app = express()
const port = 5000;

/**
 * @function connectMongoDB
 * @desc builds connection to MongoDB database
 */

async function connectMongoDB() {
  try {
    // connect to database server
    app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://localhost:27017", {
      useNewUrlParser: true
    });
    // connect to my database "locationsdatabase"
    app.locals.db = await app.locals.dbConnection.db("locationsdatabase");
    console.log("Using db: " + app.locals.db.databaseName);
  } catch (error) {
    console.dir(error);
    setTimeout(connectMongoDB, 5000);
  }
}

// executing the connectMongoDB function to connect to the database
connectMongoDB();

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist'));
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
app.get('/linkedindex.html', (req, res) => {
  res.sendFile(__dirname + '/locationcreator.html');
});

// handler for getting items
app.get("/item", (req, res) => {
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
  console.log("POST", req.body);
  app.locals.db.collection('items').insertOne(req.body);
});

// deleting ddata to the given database
app.delete('/delete-input', (req, res) => {
  app.locals.db.collection('items').deleteOne({
    "_id": ObjectId(req.body._id)
  });
});

// updating data stored in the given database
app.put('/update-input', (req, res) => {
  app.locals.db.collection('items').updateOne({
    "_id": ObjectId(req.body._id)
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
