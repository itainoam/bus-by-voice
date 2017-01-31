var express = require('./app/express');
var config = require('./config/env/development');

var app = express();

var server = app.listen(config.port, function() {
    console.log('server listening on port ' + config.port)
});



