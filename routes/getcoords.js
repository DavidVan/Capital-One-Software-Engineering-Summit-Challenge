var express = require('express');
var http = require('http');
var router = express.Router();

// Handle GET request for getcoords page.
router.get('/', function(req, res, next) {
    res.send('Nothing to see here!');
});

// Handle POST request for getcoords page.
router.post('/', function(req, res, next) {
    var getData = function(callback) {
        var options = {
            hostname: 'ip-api.com',
            path: '/json/' + (req.headers['x-forwarded-for'] || req.connection.remoteAddress),
            method: 'GET'
        };
        http.request(options, function(res) {
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
});


module.exports = router;