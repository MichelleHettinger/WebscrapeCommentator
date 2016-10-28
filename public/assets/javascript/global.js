// Front-end JS code for homework solution
// =======================================

// when the document is ready
$(document).ready(function() {

  // when the visitor clicks on the #seek-box
  $("#seek-box").click(function() {

    // grab whatever article data has been scraped into our db
    // and populate the proper sections.
    populate();

    // hide the initial seek box from view
    $("#seek-box").hide();

  });






});

// set up these global variables
var mongoData;
var commentData;
var dataCount = 0;

// these variables let the fancy cube on our the page function properly
var state = 0;
var cubeRotateAry = ['show-front', 'show-back', 'show-right', 'show-left', 'show-top', 'show-bottom'];
var sideAry = ['back', 'right', 'left', 'top', 'bottom', 'front'];

// ajax get news articles
var populate = function() {

  // jQuery AJAX call for JSON to grab all articles scraped to our db
  $.getJSON('/articles', function(data) {

    // save the articles object data to our mongoData variable
    mongoData = data;

    console.log(data);

  })
  // when that's done
  .done(function() {
    // running clickBox and saveComment functions
    clickBox();
    saveComment();
  });
};

// This function handles what happens when the cube is clicked
var clickBox = function() {
  $("#cube").on("click", function() {
    // rotate cycle
    if (state <= 5) {
      state++;
    } else {
      state = 0;
    }
    // add the proper states to the cube based on where it's clicked
    $('#cube').removeClass().addClass(cubeRotateAry[state]);

    //animate headline
    headline();

    //animate text
    typeIt();

    //render comments
    gather();

    //enable delete click listener
    deleteComment();

    //show the comment boxes
    $("#input-area").show();
    $("#saved-area").show();
  });
};

// render the headline headline
var headline = function() {
  // create the text related to the number of the current article
  var show = "|| Article:" + (dataCount + 1) + " ||";
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

// This function handles typing animations
var typeIt = function() {
  $("#typewriter-headline").remove();
  $("#typewriter-summary").remove();
  var h = 0;
  var s = 0;
  var newsText;

  if (state > 0) {
    side = state - 1;
  } else {
    side = 5;
  }

  $("." + sideAry[side]).append("<div id='typewriter-headline'></div>");
  $("." + sideAry[side]).append("<div id='typewriter-summary'></div>");

  // cycle to different story
  console.log(mongoData);
  var headline = mongoData[dataCount].title;
  var summary = mongoData[dataCount].summary;
  dataCount++;
  console.log("Article #: " + dataCount);
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
var gather = function() {

  // find the article's current id
  var idCount = dataCount - 1;


  // jQuery AJAX call for JSON to grab all articles scraped to our db
  $.getJSON('/comments', function(data) {

    // save the articles object data to our mongoData variable
    commentData = data;

    if (commentData[idCount-1]){
      console.log("Article ID: " + commentData[idCount-1]._id);
    }

  })


  // with that done, post the current Comments to the page
  .done(function(currentComments) {
    console.log(currentComments);
    postComment(currentComments);
  })

  // if something went wrong, tell the user
  .fail(function() {
    console.log("Sorry. Server unavailable.");
  });
};

// function containing listener to save comments and clear comment taking area
var saveComment = function() {


  // when someone clicks the comment button
  $("#comment-button").on('click', function() {

    // grab the value from the input box
    var text = $("#input-box").val();

    console.log("Comment: " + text)

    // grab the current article's id
    var idCount = dataCount - 1;

    console.log("Array Position: " + idCount);

    // ajax call to save the comment
    $.ajax({
      type: "POST",
      dataType: "json",
      url: '/save',
      data: {
        id: mongoData[idCount]._id,
        comment: text
      }
    })
    // with that done
    .done(function() {

      // empty the input box
      $("#input-box").val("");

      // grab the comments again because we just saved a new comment
      gather();
    })
    // if it fails, give the user an error message
    .fail(function() {
      console.log("Sorry. Server unavailable.");
    });

  });
};


// render comments from data in the last function
var postComment = function(currentComments) {

  // remove inputs from the comment box
  $("#comment-box").val("");

  // make an empty placeholder var for a comment
  var comment = "";

  // for each of the comments
  for (var i = 0; i < currentComments.length; i++) {

    // make the comment variable equal to itself, 
    // plus the new comment and a new line
    comment = comment + currentComments[i].textBody + '\n';
  }
  // put the current collection of comments into the commentbox
  $("#comment-box").val(comment);
};



// function containing listener to delete comments and clear comment taking area
var deleteComment = function() {

  // when user clicks delete button
  $("#delete-button").on('click', function() {

    // make the idCount equal the current article
    var idCount = dataCount - 1;

    // send an ajax call to delete
    $.ajax({
      type: "DELETE",
      dataType: "json",
      url: '/delete',
      data: {
        id: mongoData[idCount]._id,
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




// Don't need to edit the functions below //






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
