#!/usr/bin/env node

var request = require('request');
var qs = require('querystring');
var argv = require('minimist')(process.argv.slice(2));
var async = require('async');

var lookup = require('./binary-lookup');

var headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'Apple-iPhone6C1/'
}

var count = 0;
var countMax = 50;
var latestUser;

if (argv.c) {
  countMax = argv.c
}

var userlist = [];
var baseUrl = 'http://api.gojek.co.id/gojek/customer/referral'
var options = {}

var refID, baseId;

if (!argv.t || typeof argv.t != 'number') {
  console.log('No target specified. (./scrape.js -t <target>)');
} else {
  async.series([
    function(callback) {
      refID = argv.t;
      console.log('referring user number ' + refID);
      console.log('referring ' + countMax + ' number of users.');
      lookup.findUser(function (index) {

        baseId = index;
        console.log('latest  user found. id: ' + baseId);
        callback(null, baseId);
      });
    },
    function (callback) {
      console.log('start of referral.')

      async.whilst(
        function () { return (count < countMax); },
        function (next) {
          async.series([
            function(cb){
              options = {
                url: baseUrl,
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                  referralId: refID,
                  referrerId: baseId
                })
              }
              // console.log(options);
              cb(null);
            },
            function(cb){
              request(options, function (error, response, body) {
                // console.log(error)
                // console.log(response)
                // console.log(body)
                if (body && error!=504) {
                  msg = 'no message available.';
                  try {
                    msg = JSON.parse(body);
                  } catch(err) {
                      // console.log("Error. message is %s", err);
                  }
                  // console.log(msg);
                  if (msg.creditTopupped >0) {
                    // console.log("added user number " + msg.customerId)
                    // count++;
                    userlist.push(msg.customerId);
                    count++;
                    // console.log(userlist)
                    // console.log(userlist.length)
                  }
                }
                cb(null);
              });
            }
          ],
          function (err, results) {
          baseId--;
          next(null);
          });
        },
        function (err) {
          console.log('end of referral.');
          console.log('referred ' + count + ' number of users.');
          console.log('user list: ' + userlist);
        }
      );


    }
  ]);


}
