///////////////////////////
////// Dependencies //////
/////////////////////////

//To run our server
var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000

//Manage request body
var bp = require('body-parser');
var logger = require('morgan');

//Database configuration with mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/webscrapecomment');
// mongoose.connect('mongodb://heroku_96x0xqxl:6dd06jm4e83mm6fveu6dbmojl0@ds137197.mlab.com:37197/heroku_96x0xqxl'); //heroku
var db = mongoose.connection;

// Schemas
var Article = require('./models/Article.js');
var Comment = require('./models/Comment.js');

//////////////////////////
////// Middleware ///////
////////////////////////

//Parsing and logging request body
app.use(bp.urlencoded({extended: false}))
app.use(logger('dev'));

//Enables access to public directory
app.use(express.static('public'));


/////////////////////////////////
///Server/Database Connection///
///////////////////////////////


//Connect to dabase and throw error if present
db.on('error', function(err) {
	console.log('Database Error: ', err);
});

app.listen(PORT, function() {
	console.log('App running on port 3000!');
});


//////////////////////////
//////// Routes /////////
////////////////////////

// Root
app.get('/', function(req,res) {
  res.send(index.html);
});
 
// Retrieve all articles
app.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Retrieve all article comments
app.get('/comments/:aID/', function(req, res){

	var aID = req.params.aID;

	Comment.find({"articleID": aID }, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});


// Posting a comment
app.post('/save', function(req, res){

	var data = {textBody: req.body.articleComment}

	console.log("Updating Article " + req.body.articleID)


	var newComment = new Comment(data);

	newComment.save(function(err, doc){
		if(err){
			console.log(err);
		} else {

			console.log("comment saved")

			Comment.findOneAndUpdate({'_id': doc._id}, {'articleID':req.body.articleID})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});

		}
	});
});


app.delete('/delete/', function(req, res){

	var aID = req.body.articleID;

	Comment.remove({'articleID': aID }, function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});
