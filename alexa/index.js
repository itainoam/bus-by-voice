'use strict';
var APP_ID = 'amzn1.ask.skill.f615f89b-30a5-4bbf-8851-7816d2a1f387';
var AlexaSkill = require('./AlexaSkill');
var ENDPOINT = 'http://79.178.51.189:1521/api/buses';
var request = require('request-promise');

var GreeterService = function() {
  AlexaSkill.call(this, APP_ID);
};
GreeterService.prototype = Object.create(AlexaSkill.prototype);

var busResponseFunction = function(intent, session, response) {
  request({
    uri: ENDPOINT,
    json: true
  }).then(function(results) {
    //todo: handle empty resultss, iterate through resultss
    if (results.length) {
      var speechOutput = 'There are ' + results.length + ' buses arriving soon to the sokolov stop near your house.';
      results.forEach(function(bus) {
        speechOutput += ' Bus number ' + bus.busNum + ' will arrive in ' + bus.etaMin + ' minutes. ';
      });
      // send response to Alexa
      response.tell(speechOutput);
    } else {
      response.tell('Currently I have no information about upcoming buses.');
    }
  });
};

GreeterService.prototype.eventHandlers.onLaunch = busResponseFunction;

GreeterService.prototype.intentHandlers = {
  nextBusIntent: busResponseFunction
};

exports.handler = function(event, context) {
  var greeterService = new GreeterService();
  greeterService.execute(event, context);
};
