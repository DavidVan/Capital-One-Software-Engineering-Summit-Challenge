var fs = require('fs');
var path = require('path');
var https = require('https');

var yelpClientID = fs.readFileSync(path.join(__dirname, 'YelpClientID'), 'utf8');
var yelpClientSecret = fs.readFileSync(path.join(__dirname, 'YelpClientSecret'), 'utf8');

var postString = 'grant_type=' + 'client_credentials' +
                 '&client_id=' + yelpClientID +
                 '&client_secret=' + yelpClientSecret;
var options = {
    hostname: 'api.yelp.com',
    port: 443,
    path: '/oauth2/token',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postString)
    }
}

var getAuth = function(callback) {
    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        var json = [];
        res.on('data', function (chunk) {
            json.push(chunk);
        });
        res.on('end', function() {
            callback(JSON.parse(json.join('')));
        });
    });

    req.write(postString);
    req.end();
}

module.exports.getToken = function(callback) {
    getAuth(function(auth) {
        callback(auth.access_token); // Return the token for use
    })
};