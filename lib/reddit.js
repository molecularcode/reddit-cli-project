var request = require('request');
var util = require('util');
var redditURL = "https://www.reddit.com/";
var jsonURL = ".json";

// This function should "return" the default homepage posts as an array of objects
function getHomepage(callback) {
  // Load reddit.com/.json and call back with the array of posts
  var redditAPIhp = redditURL + jsonURL;
  request(redditAPIhp, function(err, result) {
    var resultObject = JSON.parse(result.body);
      callback(resultObject);
  }); 
}

// getHomepage(function(result) {
//   console.log(result);
// });


/* This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter. */
function getSortedHomepage(sortingMethod, callback) {
  // Load reddit.com/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  var redditAPIhpSort = redditURL + sortingMethod + "/" + jsonURL;
  var sortWord = ["hot", "new", "rising", "controversial", "top", "gilded"];
  if (sortWord.indexOf(sortingMethod) > -1) {
    request(redditAPIhpSort, function(err, result) {
      var resultObject = JSON.parse(result.body);
        callback(resultObject);
    });
  }
  else {
    console.log("This is not a valid reddit category for sorting, please enter a new option from hot, new, rising, controversial, top or gilded.");
  }
    
}

// getSortedHomepage("top", function(result) {
//   // view the whole object using util object
//   console.log(util.inspect(result, { showHidden: true, depth: 2 /* num of levels deep */, colors: true }));
// });


/* This function should "return" the posts on the front page of a subreddit as an array of objects. */
function getSubreddit(subreddit, callback) {
  // Load reddit.com/r/{subreddit}.json and call back with the array of posts
  var redditAPIsub = redditURL + "r/" + subreddit + "/" + jsonURL;
    request(redditAPIsub, function(err, result) {
      var resultObject = JSON.parse(result.body);
        callback(resultObject);
    });
}

// getSubreddit("stuff", function(result) {
//   console.log(util.inspect(result, { showHidden: true, depth: null, colors: true }));
// });


/* This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter. */
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  // Load reddit.com/r/{subreddit}/{sortingMethod}.json and call back with the array of posts
  // Check if the sorting method is valid based on the various Reddit sorting methods
  var redditAPIsubSort = redditURL + "r/" + subreddit + "/" + sortingMethod + "/" + jsonURL;
  var sortWord = ["hot", "new", "rising", "controversial", "top", "gilded"];
  if (sortWord.indexOf(sortingMethod) > -1) {
    request(redditAPIsubSort, function(err, result) {
      var resultObject = JSON.parse(result.body);
        callback(resultObject);
    });
  }
  else {
    console.log("This is not a valid reddit category for sorting, please enter a new option from hot, new, rising, controversial, top or gilded.");
  }
    
}

// getSortedSubreddit("stuff", "top", function(result) {
//   console.log(util.inspect(result, { showHidden: true, depth: null, colors: true }));
// });


/* This function should "return" all the popular subreddits */
function getSubreddits(callback) {
  // Load reddit.com/subreddits.json and call back with an array of subreddits
  var redditAPIsubPop = redditURL + "subreddits" + "/" + jsonURL;
  request(redditAPIsubPop, function(err, result) {
      var resultObject = JSON.parse(result.body);
        callback(resultObject);
    });
}

// getSubreddits(function(result) {
//   console.log(util.inspect(result, { showHidden: true, depth: null, colors: true }));
// });


// Export the API
module.exports = {
  redditURL: redditURL,
  jsonURL: jsonURL,
  getHomepage: getHomepage,
  getSortedHomepage: getSortedHomepage,
  getSubreddit: getSubreddit,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddits: getSubreddits
};
