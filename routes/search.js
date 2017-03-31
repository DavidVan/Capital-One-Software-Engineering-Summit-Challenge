var express = require('express');
var https = require('https');
var router = express.Router();
var yelp = require('../yelp');

// Handle GET request for search page.
router.get('/', function(req, res, next) {
    res.send('Nothing to see here!');
});

// Handle POST request for search page.
router.post('/', function(req, res, next) {
    var searchTerm = req.body.searchTerm;
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;
    if (searchTerm === '') {
        return res.json({'error': 'No search term provided.'});
    }
    if (latitude === '') {
        return res.json({'error': 'No latitude provided.'});
    }
    if (longitude === '') {
        return res.json({'error': 'No longitude provided.'});
    }
    yelp.getToken(function (token) {
        var searchPath = '/v3/businesses/search?' +
                            'term=' + encodeURIComponent(searchTerm) +
                            '&latitude=' + latitude +
                            '&longitude=' + longitude;
        var getData = function(callback) {
            var options = {
                hostname: 'api.yelp.com',
                port: 443,
                path: searchPath,
                method: 'GET',
                headers: {'Authorization': 'Bearer ' + token}
            };
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
        };
        getData(function(json) {
            res.json(JSON.parse(json));
        });
        // res.json({'a':'a'});
    });
});

module.exports = router;