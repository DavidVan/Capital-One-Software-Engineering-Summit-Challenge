var express = require('express');
var fs = require('fs');
var path = require('path');
var router = express.Router();

var googleAPIKey = fs.readFileSync(path.join(__dirname, '..\\GoogleAPIKey'), 'utf8').replace(/\r?\n|\r/g,''); // Remove line endings.

// Handle GET request for index page.
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Foodie',
        GoogleAPIKey: googleAPIKey
    }); // Looks for index.ejs file under 'views' folder.
});

module.exports = router;