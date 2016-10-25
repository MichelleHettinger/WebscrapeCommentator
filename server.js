//////////////////////////
////// Dependencies //////
//////////////////////////

//To run our server
var express = require('express');
var app = express();

//Manage request body
var bp = require('body-parser');
var logger = require('morgan');

//Render query data
var exphbs = require('express-handlebars');

//File containing all the routes
var routes = require('./controllers/webscrapercommentator.js');

//Database configuration with mongoose
var mongoose = require('mongoose');
var databaseUrl = "webscraper";
var collections = ["comments"];
mongoose.connect('mongodb://localhost/week18day3mongoose');
var db = mongoose.connection;

//////////////////////////
////// Actual code //////
/////////////////////////

//Enables access to public directory
app.use(express.static('public'));

//Parsing and logging request body
app.use(bp.urlencoded({extended: false}))
app.use(logger('dev'));

//Set up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//Connect to dabase and throw error if present
db.on('error', function(err) {
	console.log('Database Error: ', err);
});

//Use the controller file to handle the routing
app.get('/', routes);

//Set app to run at port 3000
var PORT = process.env.PORT || 3000

app.listen(PORT, function() {
	console.log('App running on port 3000!');
});