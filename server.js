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

// Viewing previous comments
app.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('comment')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});


// Posting a comment
app.post('/save', function(req, res){
	var newComment = new Comment(req.body);

	newComment.save(function(err, doc){
		if(err){
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
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


// app.delete('/delete', function(req, res){

// });
