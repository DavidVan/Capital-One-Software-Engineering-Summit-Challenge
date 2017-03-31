var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');

var index = require('./routes/index'); // Include our index.js file from 'routes' folder.
var about = require('./routes/about'); // Include our about.js file from 'routes' folder.
var search = require('./routes/search'); // Include our search.js file from 'routes' folder.

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public'))); // Expose the 'public' folder.
app.set('views', path.join(__dirname, 'views')); // Make sure we have the right 'views' folder defined.

app.set('view engine', 'ejs'); // Set view engine to use ejs.

app.use('/', index); // Serve the index page.
app.use('/about', about); // Serve the about page.
app.use('/search', search); // Serve the about page.

app.listen(1337);
console.log('Server running on port 1337');