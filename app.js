var express = require('express');
var path = require('path');

var index = require('./routes/index'); // Include our index.js file from 'routes' folder.
var about = require('./routes/about'); // Include our about.js file from 'routes' folder.

var app = express();

app.use(express.static(path.join(__dirname, 'public'))); // Expose the 'public' folder.
app.set('views', path.join(__dirname, 'views')); // Make sure we have the right 'views' folder defined.

app.set('view engine', 'ejs'); // Set view engine to use ejs.

app.use('/', index); // Serve the index page.
app.use('/about', about); // Serve the about page.

app.listen(3000);
console.log('Server running on port 3000');