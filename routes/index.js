var express = require('express');
var router = express.Router();

// Handle GET request for index page.
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Something' }); // Looks for index.ejs file under 'views' folder.
});

module.exports = router;