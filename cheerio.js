// Dependencies:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html
var mongoose = require('mongoose'); // To connect with mongodb

// Schemas
var Article = require('./models/Article.js');
var Note = require('./models/Comment.js');

//Database configuration
mongoose.connect('mongodb://localhost/webscrapecomment');
var db = mongoose.connection;


// Make a request call to grab the html body from the site of your choice
// Notice: the page's html gets saved as the callback's third arg
request("http://www.nytimes.com/pages/technology/index.html", function (error, response, html) {

	// Load the html into cheerio and save it to a var.
  var $ = cheerio.load(html);

  // console.log(html);

  var result = [];

  // Select each instance of the html body that you want to scrape.
  $('.aColumn .story').each(function(i, element){

    // Scrape information from the web page, put it in an object 
    // and add it to the result array.
    var articleTitle = $(this).children('h3').children('a').text();
    var articleURL = $(this).children('h3').children('a').attr('href');
    var articleBody = $(this).children('.summary').text();


    var data = {
      title: articleTitle,
      link: articleURL,
      summary: articleBody
    }


    result.push(data);


    var entry = new Article (data);

    entry.save(function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
      }
    });


  });


  //Console log the data that was pulled
  for(i=0; i<result.length; i++){
    console.log(result[i].title
      + result[i].summary + "\n"
      + result[i].link + "\n \n");
  }


});