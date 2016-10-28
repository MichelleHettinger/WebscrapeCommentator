// Dependencies:
var request = require('request'); // Snatches html from urls
var cheerio = require('cheerio'); // Scrapes our html

// Make a request call to grab the html body from the site of your choice
// Notice: the page's html gets saved as the callback's third arg
request("http://www.nytimes.com/pages/technology/index.html", function (error, response, html) {

	// Load the html into cheerio and save it to a var.
  // '$' becomes a shorthand for cheerio's selector commands, 
  //  much like jQuery's '$'.
  var $ = cheerio.load(html);


  // console.log(html);


  // an empty array to save the data that we'll scrape
  var result = [];

  // Select each instance of the html body that you want to scrape.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors, 
  // but be sure to visit the package's npm page to see how it works.
  $('.aColumn .story').each(function(i, element){

    // Scrape information from the web page, put it in an object 
    // and add it to the result array.
    var title = $(this).children('h3').children('a').text();
    var url = $(this).children('h3').children('a').attr('href');
    var body = $(this).children('.summary').text();


    var data = {
      articleTitle: title,
      articleURL: url,
      articleBody: body
    }


    result.push(data);

  });


  for(i=0; i<result.length; i++){
    console.log(result[i].articleTitle
      + result[i].articleBody + "\n"
      + result[i].articleURL + "\n \n");
  }


});