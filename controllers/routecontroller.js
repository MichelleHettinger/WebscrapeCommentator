var express = require("express");
var router = express.Router();
var bp = require("body-parser");



router.get('/', function(req,res) {
	res.render('home')
});




module.exports = router;