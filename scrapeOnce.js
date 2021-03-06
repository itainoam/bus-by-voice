var scrapeBuses = require('./scrapeBuses');
var low = require('lowdb');

const db = low('./schedules.json');

db.defaults({ schedules: []})
  .value();
  
  scrapeBuses().then(function(results) {
    db.set('schedules', results)
      .value();
});