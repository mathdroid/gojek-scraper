#!/usr/bin/env node

//find the index of the newest user.
var request = require('request');
var qs = require('querystring');
var async = require('async');
var program = require('commander');

//headers for our request
var headers = {
    'Content-Type':     'application/json',
    'User-Agent': 'Apple-iPhone6C1/'
}

//base number for user. The lowest Million available is 543xxxxxx and the highest 545xxxxxx as of 2015-09-03.
var userSetup = {
  'numberBase': 545000000,
  'baseUrl': 'http://api.gojek.co.id/gojek/customer/'
}
var driverSetup = {
  'numberBase': 540170000,
  'baseUrl': 'http://api.gojek.co.id/gojek/drivers/'
}
var bookingSetup = {
  'numberBase': 559000000,
  'baseUrl': 'http://api.gojek.co.id/gojek/booking/'
}

//vars and shit for our main function.
var result, index, options, numberBase, baseUrl;

function lookup(decimator, cb) {
  async.series([
      function(callback){
        index = numberBase + decimator;
        options = {
          url: baseUrl+index,
          method: 'GET',
          headers: headers
        }
        // console.log('looking in index ' + index + '.');
        callback(null, options);
      },
      function(callback){
        request(options, function (error, response, body) {
                result = body;
                callback(null);
        })
      }
  ],
  function (err, results) {
    if (result==='' && decimator >= 10) {
      return lookup(decimator/10, cb);
    } else if (result!=='') {
      numberBase += decimator;
      return lookup(decimator, cb);
    } else {
      console.log('last index is: ' + index + '.');
      cb();
      return index;
    }
  });
}

function findUser(cb) {
  console.log('looking for users.');
  numberBase = userSetup.numberBase;
  baseUrl = userSetup.baseUrl;
  return lookup(100000, function () {cb();});
}
function findDriver(cb) {
  console.log('looking for drivers.');
  numberBase = driverSetup.numberBase;
  baseUrl = driverSetup.baseUrl;
  return lookup(100000, function () {cb();});
}
function findBooking(cb) {
  console.log('looking for bookings.');
  numberBase = bookingSetup.numberBase;
  baseUrl = bookingSetup.baseUrl;
  return lookup(100000, function () {cb();});
}
program.version('o.1.0');

program
  .command('user')
  .description('find the last user in Go-Jek database.')
  .action(findUser);

program
  .command('driver')
  .description('find the last driver in Go-Jek database.')
  .action(findDriver);


program
  .command('booking')
  .description('find the last booking in Go-Jek database.')
  .action(findBooking);

program
  .command('all')
  .description('find the last indexes in Go-Jek database.')
  .action(function(){
    async.series([
        function(callback){
          findUser(function () {callback(null)});
        },
        function(callback){
          findDriver(function () {callback(null)});
        },
        function(callback){
          findBooking(function () {callback(null)});
        }
    ]);
  });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
