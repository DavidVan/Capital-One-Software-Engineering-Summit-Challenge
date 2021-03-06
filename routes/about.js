var express = require('express');
var router = express.Router();

// Handle GET request for the about page.
router.get('/', function(req, res, next) {
    res.render('about', {
        title: 'About Foodie'
    }); // Looks for about.ejs file under 'views' folder.
});

module.exports = router;