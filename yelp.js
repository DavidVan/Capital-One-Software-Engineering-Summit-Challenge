var fs = require('fs');

var yelpClientID = fs.readFileSync('YelpClientID', 'utf8');
var yelpClientSecret = fs.readFileSync('YelpClientSecret', 'utf8');

var credentials = {
    client: {
        id: yelpClientID,
        secret: yelpClientSecret
    },
    auth: {
        tokenHost: 'https://api.yelp.com',
        tokenPath: '/oauth2/token'
    }
};

var oauth2 = require('simple-oauth2').create(credentials);
var tokenConfig = {};

module.exports.getToken = function(callback) {
    oauth2.clientCredentials.getToken(tokenConfig, function(error, result) {
        if (error) {
            return console.log('Access Token Error', error.message);
        }

        callback(oauth2.accessToken.create(result).token.access_token); // Return the token
    });
};