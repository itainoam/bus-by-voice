var express = require('express');
var routes = require('./routes/data.server.routes.js')
var bodyParser = require('body-parser')
var scrapeBuses = require('../scrapeBuses')

var low = require('lowdb');

// commented out for using scrapeOnce
//var low = require('lowdb');
// const db = low('schedules.json')
//
// db.defaults({ schedules: []})
//   .value();

module.exports = function() {
  var app = express();
  
  routes(app)
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static('public'));
  
  var scrapInProg = false;
  
  function loadData() {
    scrapInProg = true;
    var scrapePromise = scrapeBuses();
    return scrapePromise;
  }
  
  function writeData(data) {
    var db = low('schedules.json');
    db.set('schedules', [])
      .value()
  
    db.get('schedules')
      .push(data)
      .value();
  }
  
  
  app.get('/api/buses', function(req, res) {
    var schedules = low('schedules.json')
      .get('schedules')
      .value()
    res.send(schedules);
  });
  
  app.get('/api/refresh', function(req, res, next) {
    console.log('get request accepted');
    if (scrapInProg) {
      res.send('scraping already in progress')
    }
    else {
      loadData()
        .then(function(results) {
          scrapInProg = false;
          writeData(results);
          next();
        })
        .catch(function(error) {
          console.error(error);
        });
    }
  });
  
  return app;
};

