var Nightmare = require('nightmare');
var cheerio = require('cheerio');
var nightmare = Nightmare({
  show: true,
  openDevTools: {
    mode: 'detach'
  },
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
    .end()
    .then(function(html) {
      var $html = cheerio.load(html);
      var schedules = parse($html);
      console.log('schedules: ', schedules);
      return schedules;
    })
    .catch(function (error) {
      console.error(error);
    });
  console.log('scrapePromise: ', scrapePromise);
  return scrapePromise
}


function parse($html) {
  var $ = $html;
  var buses = $html('.line-number')
  
  var results = [];
  var releventBusNums = ['501','502','29','247'];
  
  var filteredBuses = buses.filter(function(idx,elem) {
    const busNum = elem.children[0].data;
    return (releventBusNums.indexOf(busNum) !== -1);
  })
  
  
  filteredBuses.each(function(idx,elem) {
    var busNum = $(elem).html();
    var eta =  $(elem).parents('route-summary').find('.eta').html();
    results.push ({busNum,eta})
  })
  
  return results
}


module.exports = scrapeBuses;