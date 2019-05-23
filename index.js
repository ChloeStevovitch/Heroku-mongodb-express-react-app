const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

var url = "mongodb://heroku_cc12z6t8:i5jc4kk17r5gfskq2nqc7e5q7p@ds115045.mlab.com:15045/heroku_cc12z6t8";
var MongoClient = require('mongodb').MongoClient;
let collection = []

MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server");
    if (err){console.log(err);}
    collection = db.collection('test');
})

app.get('/api/users', (req, res) => {
  collection.find().toArray(function(err, docs) {
    res.json(docs)
  })
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Password generator listening on ${port}`);