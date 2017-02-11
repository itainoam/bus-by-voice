var Nightmare = require('nightmare');
var cheerio = require('cheerio');
var _ = require('lodash');
var nightmare = Nightmare({
  show: false,
  openDevTools: {
    mode: 'detach'
  }
});

var results;

function scrapeBuses() {
  console.log('scraping started');
  var scrapePromise = nightmare
    .useragent('Mozilla/5.0 (Windows NsT 6.3; WOW64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36')
    .goto('https://moovitapp.com/?from=%D7%91%D7%9F%20%D7%92%D7%95%D7%A8%D7%99%D7%95%D7%9F~2F%D7%A1%D7%95%D7%A7%D7%95%D7%9C%D7%95%D7%91&to=%D7%A7%D7%A0%D7%99%D7%95%D7%9F%20%D7%A2%D7%96%D7%A8%D7%99%D7%90%D7%9C%D7%99%20&fll=32.167264_34.842138&tll=32.074757_34.791341&routeTypes=bus&timeType=depart&time=1485704700000&metroId=1&lang=en')
    .wait('.suggested-routes md-list')
    .evaluate(function (selector) {
      results =  document.querySelector(selector).innerHTML;
      return results;
    }, '.suggested-routes md-list')
    .then(function(html) {
      var $html = cheerio.load(html);
      var schedules = parse($html);
      console.log('schedules: ', schedules);
      return schedules;
    }).then(function(schedules) {
      // makes sure non of the electron processes are left running
      nightmare.end();
      nightmare.proc.disconnect();
      nightmare.proc.kill();
      nightmare.ended = true;
      nightmare = null;
      return schedules;
    })
    .catch(function (error) {
      console.error(error);
    });
  console.log('scrapePromise: ', scrapePromise);
  return scrapePromise
}


function parse($html) {
  // TODO: test that remove duplicates work and figure out why some buses with time
  var $ = $html;
  var buses = $html('.line-number');
  
  var results = [];
  var resultsUniq;
  var releventBusNums = ['501','502','29','247'];
  
  var filteredBuses = buses.filter(function(idx,elem) {
    const busNum = elem.children[0].data;
    return (releventBusNums.indexOf(busNum) !== -1);
  });
  
  
  filteredBuses.each(function(idx,elem) {
    var minutesRE = /\d+/;
    var busNum = $(elem).html();
    var eta =  $(elem).parents('route-summary').find('.eta').html();
    var etaMin = minutesRE.exec(eta)[0];
  
    results.push ({busNum:busNum,etaMin:etaMin})
  });
  
  resultsUniq = _.uniqBy(results, function(elem) { return [elem.busNum, elem.eta].join(); });
    
  return resultsUniq
}


module.exports = scrapeBuses;