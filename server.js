//////////////////////////
////// Dependencies //////
//////////////////////////

//To run our server
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000

//Manage request body
var bp = require('body-parser');
var logger = require('morgan');

//Render query data
var exphbs = require('express-handlebars');

//File containing all the routes
var routes = require('./controllers/routecontroller.js');

//Database configuration with mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/webscrapecomment');
var db = mongoose.connection;

//Pathing
var path = require('path');


// Schemas
var Article = require('./models/Article.js');
var Note = require('./models/Comment.js');

//////////////////////////
////// Middleware ///////
/////////////////////////

//Parsing and logging request body
app.use(bp.urlencoded({extended: false}))
app.use(logger('dev'));

//Set up handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Enables access to public directory
app.use(express.static('public'));
// app.use(express.static(__dirname + '/public'));
// app.use(express.static(path.join(__dirname,'public')));

// console.log("-----------------------------------")
// console.log(app.use(express.static(__dirname)));

//////////////////////////
////// Actual code //////
/////////////////////////


//Connect to dabase and throw error if present
db.on('error', function(err) {
	console.log('Database Error: ', err);
});

//Use the controller file to handle the routing
app.get('/', routes);

app.listen(PORT, function() {
	console.log('App running on port 3000!');
});