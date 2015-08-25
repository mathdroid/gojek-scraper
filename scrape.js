var request = require('request');

var qs = require('querystring');

// Set the headers
var headers = {
    // 'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/json'
}
var count = 0;
var userlist = [];

var baseId = 538589523
// 544655450
// var baseUrl = 'http://api.gojek.co.id/gojek/customer/'
var baseUrl = 'http://api.gojek.co.id/gojek/customer/referral'
var options = {}

for (baseId=544698150; baseId<544698350; baseId++) {

  // Configure the request
  options = {
      url: baseUrl,
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        referralId: 542832278,
        referrerId: baseId+1
      })
  }

  // Start the request
  request(options, function (error, response, body) {
      // if (!error) {
          // Print out the response body
          // console.log(error)
          // console.log(response)
          // console.log(body)
          if (body && error!=504) {
            try {
              msg = JSON.parse(body);
            } catch(err) {
                console.log("Error. message is %s", err);
            }
            // console.log(msg);

            if (msg.creditTopupped >0) {
              console.log("added user number " + msg.customerId)
              count++;
              userlist.push(msg.customerId);
              console.log(userlist)
              console.log(userlist.length)
            }
          }


      // }
  })
}
