// Dependencies
var express = require("express");
var router = express.Router();
var bp = require("body-parser");

// Schemas
var Article = require('./models/Article.js');
var Comment = require('./models/Comment.js');

router.get('/', function(req,res) {
	res.render('home')
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


// Posting a comment
app.post('/articles/:id', function(req, res){
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


module.exports = router;