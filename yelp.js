var fs = require('fs');
var path = require('path');


// Read from file, or insert here. Your choice.
var yelpClientID = fs.readFileSync(path.join(__dirname, 'YelpClientID'), 'utf8').replace(/\r?\n|\r/g,''); // Remove line endings.
var yelpClientSecret = fs.readFileSync(path.join(__dirname, 'YelpClientSecret'), 'utf8').replace(/\r?\n|\r/g,''); // Remove line endings.

var credentials = {
    client: {
        id: yelpClientID,
        secret: yelpClientSecret
    },
    auth: {
        tokenHost: 'https://api.yelp.com',
        tokenPath: '/oauth2/token',
        revokePath: '/oauth2/revoke'
    }
};

var oauth2 = require('simple-oauth2').create(credentials);
var tokenConfig = {};

module.exports.getToken = function(callback) {
    oauth2.clientCredentials.getToken(tokenConfig, function(error, result) {
        if (error) {
            return console.log('Access Token Error', error.message);
        }

        callback(oauth2.accessToken.create(result).token.access_token); // Return the token for use
    });
};