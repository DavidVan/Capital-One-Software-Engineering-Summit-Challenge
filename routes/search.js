var express = require('express');
var https = require('https');
var router = express.Router();
var yelp = require('../yelp');

// Handle GET request for search page.
router.get('/', function(req, res, next) {
    yelp.getToken(function (token) {
        var getData = function(callback) {
            var options = {
                hostname: 'api.yelp.com',
                port: 443,
                path: '/v3/businesses/search?term=delis&latitude=37.786882&longitude=-122.399972',
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token}
            }
            https.request(options, function(res) {
                res.setEncoding('utf8');
                var json = [];
                res.on('data', function (chunk) {
                    json.push(chunk);
                });
                res.on('end', function() {
                    callback(json.join(''));
                });
            }).end();
        }
        getData(function(json) {
            res.json(JSON.parse(json));
        });
        // res.json({'a':'a'});
    });
});

module.exports = router;