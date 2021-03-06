var request = require('request');
var util = require('util');
var redditURL = "https://www.reddit.com/";
var jsonURL = ".json";

// Create an array of my post objects from the returned reddit object
function createPostObj(result, callback) {
    var resultObj = JSON.parse(result.body);
    var postArr = resultObj.data.children.map(function(obj) {
        var postObj = {};
        var inqObj = {
            name: obj.data.title,
            value: postObj[obj.data.id] = {
                title: obj.data.title,
                url: obj.data.url,
                ups: obj.data.ups,
                downs: obj.data.downs,
                author: obj.data.author,
                created: obj.data.created_utc,
                subredditName: obj.data.subreddit
            }
        };
        return(inqObj);
    });
    callback(postArr);
}

// "Return" the default homepage posts as an array of post objects
function getHomepage(callback) {
    var redditAPIhp = redditURL + jsonURL;
    request(redditAPIhp, function(err, result) {
        createPostObj(result, function(postArr) {
            callback(postArr); 
        });
    }); 
}

//getHomepage(console.log);


/* "Return" the default homepage posts as an array of objects and sort by the 'sortingMethod' parameter. */
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
      createPostObj(result, function(postArr) {
            callback(postArr); 
        });
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


// convert user input to lowercase and remove spaces for UR
function convertLower(str) {
    return str.toLowerCase().replace(/\s+/g, '');
}


// check if the ipnut is empty, 
function isEmpty(obj, srAnswer, callback) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    callback("Sorry, '" + srAnswer + "' is not actually a subreddit, please enter a different subreddit or try choosing from the list of popular subreddits in the menu below.\n");
}


// // Check if url contains an img
// function img(url, callback) {
//     var urlEnd = url.substr(url.length - 4);
//     if (urlEnd === ".jpg" || urlEnd === ".gif" || urlEnd === ".png" ) {
//         callback(urlEnd);
//         imageToAscii(answer.srClickable.url, {
//             size: {
//                 height: "40%"
//             }
//         }, function(err, converted) {
//             console.log(err || converted);
//         });
//     }
// }


// Export the API
module.exports = {
  redditURL: redditURL,
  jsonURL: jsonURL,
  getHomepage: getHomepage,
  getSortedHomepage: getSortedHomepage,
  getSubreddit: getSubreddit,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddits: getSubreddits,
  convertLower: convertLower,
  isEmpty: isEmpty,
    // img: img
};
