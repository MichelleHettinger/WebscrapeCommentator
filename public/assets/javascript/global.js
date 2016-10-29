// Front-end JS code for homework solution
// =======================================

// when the document is ready
$(document).ready(function() {

  // when the visitor clicks on the #seek-box
  $("#seek-box").click(function() {

    // Start the serires of ajax calls
    ajaxGetArticles();

    // Enables click box functionality
    clickBox();

    //enable delete click listener
    deleteComment();

    //enable posting comment
    ajaxPostComment();

    // hide the initial seek box from view
    $("#seek-box").hide();

  });

});

var globalObject = {

  articleData: null,     // To store current article data
  articleComments: null,     // To store current article comments
  dataCount: 0,          // For keeping track of article position in array
  articleCount: 1,

  // These variables let the fancy cube on our the page function properly
  state: 0,
  cubeRotateAry: ['show-front', 'show-back', 'show-right', 'show-left', 'show-top', 'show-bottom'],
  sideAry: ['back', 'right', 'left', 'top', 'bottom', 'front']

}





// This function starts the series of retreiving all data and displaying it
var ajaxGetArticles = function() {

  // jQuery AJAX call for JSON to grab all articles scraped to our db
  $.getJSON('/articles', function(data) {

    // Save the articles object data to our articleData variable
    globalObject.articleData = data;

  })
  // When that's done
  .done(function() {

    // Then display them
    renderArticle();

    // Also get the comments for that specific article
    ajaxGetComments();
  });
};
// This function handles typing animations
var renderArticle = function() {
  $("#typewriter-headline").remove();
  $("#typewriter-summary").remove();
  var h = 0;
  var s = 0;
  var newsText;

  if (globalObject.state > 0) {
    globalObject.side = globalObject.state - 1;
  } else {
    globalObject.side = 5;
  }

  $("." + globalObject.sideAry[globalObject.side]).append("<div id='typewriter-headline'></div>");
  $("." + globalObject.sideAry[globalObject.side]).append("<div id='typewriter-summary'></div>");

  // cycle to different story
  console.log(globalObject.articleData);

  // dataCount starts at zero, since the first article is at position 0 in the array.
  var headline = globalObject.articleData[globalObject.dataCount].title;
  var summary = globalObject.articleData[globalObject.dataCount].summary;

  console.log("Article #: " + globalObject.articleCount);

  // type animation for new summary
  (function type() {
    //console.log(newsText);
    printHeadline = headline.slice(0, ++h);
    printSummary = summary.slice(0, ++s);


    // put in the text via javascript
    $("#typewriter-headline").text(printHeadline);
    $("#typewriter-summary").text(printSummary);

    // return stop when text is equal to the writeTxt
    if (printHeadline.length === headline.length && printSummary.length === summary.length) {
      return;
    }
    setTimeout(type, 35);
  }());
};
// ajax get comments
var ajaxGetComments = function() {

  globalObject.articleComments = null;

  console.log(globalObject.articleData)

  var articleID = globalObject.articleData[globalObject.dataCount]._id;
  console.log("articleID: " + articleID)

  // Get the comment correlating with the current article
  $.getJSON('/comments/' + articleID, function(data) {

    console.log(data)

    // save the articles comment data to our commentData variable
    globalObject.articleComments = data;

    console.log(globalObject.articleComments)

  })
  // After that finishes
  .done(function() {

    renderComment(globalObject.articleComments);

  })

  // if something went wrong, tell the user
  .fail(function() {
    console.log("Sorry. Server unavailable.");
  });
};
// Executed following ajaxGetComments
var renderComment = function(currentComments) {

  // remove inputs from the comment box
  $("#comment-box").val("");

  // make an empty placeholder var for a comment
  var comment = "";

  for (var i = 0; i < currentComments.length; i++) {

    // make the comment variable equal to itself, 
    // plus the new comment and a new line
    comment = comment + currentComments[i].textBody + '\n';
  }

  console.log(comment);

  // put the current collection of comments into the commentbox
  $("#comment-box").val(comment);
};


// This function handles what happens when the cube is clicked
var clickBox = function() {

  $("#cube").on("click", function() {
    // Increment the article and array position
    globalObject.dataCount++;
    globalObject.articleCount++;

    // Clear out the comments array
    globalObject.articleComments = null

    $("#comment-box").val("");

    // rotate cycle
    if (globalObject.state <= 5) {
      globalObject.state++;
    } else {
      globalObject.state = 0;
    }
    // add the proper states to the cube based on where it's clicked
    $('#cube').removeClass().addClass(globalObject.cubeRotateAry[globalObject.state]);

    //animate headline
    headline();

    //show the comment boxes
    $("#input-area").show();
    $("#saved-area").show();

    // Render current article
    renderArticle();
    // Get and render that articles comments
    ajaxGetComments();


  });
};
// render the headline headline
var headline = function() {
  // create the text related to the number of the current article
  var show = "|| Article:" + (globalObject.dataCount + 1) + " ||";
  // place it in the text box
  $("#headline").text(show);
  // fade the headline in
  $("#headline").fadeIn()
    // and add these style properties to it
    .css({
      position: 'relative',
      'text-align':'center',
      top:100
    })
    .animate({
      position:'relative',
      top: 0
    });
};






// Posting comment to database
var ajaxPostComment = function() {


  // when someone clicks the comment button
  $("#comment-button").on('click', function() {

    // grab the value from the input box
    var textComment = $("#input-box").val();

    console.log("Comment: " + textComment)

    console.log("Array Position: " + globalObject.dataCount);

    console.log("ArticleID: " + globalObject.articleData[globalObject.dataCount]._id)

    // ajax call to save the comment
    $.ajax({
      type: "POST",
      dataType: "json",
      url: '/save',
      data: {
        articleID: globalObject.articleData[globalObject.dataCount]._id,
        articleComment: textComment
      }
    })
    // with that done
    .done(function() {

      // empty the input box
      $("#input-box").val("");
      // empty the comment box
      $("#comment-box").val("");

      // grab the comments again because we just saved a new comment
      ajaxGetComments();
    })
    // if it fails, give the user an error message
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};



// function containing listener to delete comments and clear comment taking area
var deleteComment = function() {

  // when user clicks delete button
  $("#delete-button").on('click', function() {

    // make the idCount equal the current article
    var article = globalObject.dataCount;

    // send an ajax call to delete
    $.ajax({
      type: "DELETE",
      dataType: "json",
      url: '/delete',
      data: {
        articleID: globalObject.articleData[globalObject.dataCount]._id,
      }
    })
    // with that done, empty the comment-box input
    .done(function() {
      $("#comment-box").val("");
    })
    // if it fails, tell the user
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};



// // ajax call to do the scrape
// var fetchData = function() {
//   // call Fetch with AJAX
//   $.ajax({
//     type: "POST",
//     url: '/fetch'
//   }).done(function() {
//     // show the seek box if it worked
//     $("#seek-box").show();
//   }).fail(function() {
//     // otherwise tell the user an issue has occurred
//     alert("Sorry. Server unavailable.");
//   });
// };








