/*  1 - Basic feature: the main menu
---------------------------------------------------------------------------------------
When the user chooses the homepage option, you should display the list of posts from the getHomepage function you created previously. For each post, list at least some of the info that appears on reddit: title, url, votes, username. After the list of posts is displayed, you should display the main menu again.


2 - Basic feature: subreddit posts
---------------------------------------------------------------------------------------
When the user chooses the subreddit posts option, you should ask him -- again using inquirer -- which subreddit he wants to see. Then, display the list of posts in the same way as the homepage.


3 - Feature: list of subreddits *
--------------------------------------------------------------------------------------
When the user chooses the list of subreddits option, you should load the list of subreddits using the getSubreddits function you created previously. Then, using inquirer, show the list of subreddits to the user. The user will be able to choose a subreddit to display its posts, or go back to the main menu. You can use an Inquirer Separator to create a visual separation between the list of subreddits and the "go back to main menu" option.


4 - Feature: post selection and "image" display **
--------------------------------------------------------------------------------------
When the user is shown a list of posts, instead of going back to the main menu every post should be selectable -- again using inquirer. When selecting a post, the terminal screen should be cleared and only that post should be displayed (title + url + username). In addition to this, if the URL of the post turns out to be an image -- ends in .jpg, .gif or .png -- you should use the image-to-ascii module to load the image and display it on the command line. After the post details are displayed, you should show the main menu again.
*/


// import my reddit module file
var reddit = require("./lib/reddit.js");

// Variables
// > npm install inquirer, colors, util
var inquirer = require('inquirer');
var colors = require('colors');
var emoji = require('node-emoji');
var util = require('util');
var currentTime = Math.floor(new Date().getTime() / 1000); // in seconds
var up = emoji.get('thumbsup').green;
var dwn = emoji.get('thumbsdown').red;


// Functions
function convertLower(str) {
    return str.toLowerCase().replace(/\s+/g, '');
}
function isEmpty(obj, srAnswer, callback) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    callback("Sorry, '" + srAnswer + "' is not actually a subreddit, please enter a different subreddit or try choosing from the list of popular subreddits in the menu below.\n");
}


// Menu
var menuChoices = [
    {name: 'Show reddit homepage', value: 'HOMEPAGE'},
    {name: 'Choose a subreddit', value: 'SUBREDDIT'},
    {name: 'List popular subreddits', value: 'SUBREDDITS'}
];

function redditRun() {
    inquirer.prompt({
      type: 'list',
      name: 'menu',
      message: 'What do you want to browse?',
      choices: menuChoices
    }).then(function(answers) {
            var posted;
            function postedTime(postedTime, currentTime) {
                var postedMins = Math.floor((currentTime - postedTime) / 60);
                if (postedMins < 60) {
                    posted = Math.round(postedMins) + " minutes ago";
                }
                else if (postedMins > 60 && postedMins < 1440) {
                    var postedHrs = Math.round(postedMins / 60);
                    posted = (postedHrs + " hours ago");
                }
                else {
                    var postedDays = Math.round(postedMins / 60 / 24);
                    posted = (postedDays + " days ago");
                }
            }

            function buildObj(page, callback) {
                var postObj = {};
                page.data.children.forEach(function(x, index) {
                    // build subreddit object
                    postObj [page.data.children[index].data.title] = {
                        id: page.data.children[index].data.id,
                        title: page.data.children[index].data.title,
                        url: page.data.children[index].data.url,
                        ups: page.data.children[index].data.ups,
                        downs: page.data.children[index].data.downs,
                        author: page.data.children[index].data.author,
                        created: page.data.children[index].data.created_utc,
                        subredditName: page.data.children[index].data.subreddit
                    };
                });
                callback(postObj);
            }
                
            function objToArr(postObj, callback) {
                var inqObj = {};
                var postArr = [];
                
                for(var prop in postObj) {
                    postedTime(postObj[prop].created, currentTime); // calculate time diff
                    // build inquirer object
                    inqObj = {
                        name: postObj[prop].title,
                        value: postObj[prop]
                    };
                    postArr.push(inqObj);
                }
                callback(postArr);
            }

            // If user wants Homepage
            if (answers.menu === 'HOMEPAGE') {
                reddit.getHomepage(function(subRedName){
                    console.log("You're browsing the front page of reddit!\n");
                    buildObj(subRedName, function(postObj) {
                        objToArr(postObj, function(postArr) {
                            inquirer.prompt({
                                type: 'list',
                                name: 'srClickable',
                                message: 'Reddit Posts',
                                choices: postArr
                            }).then(function(answer) {
                                console.log('\033c');
                                console.log(answer.srClickable.title.bold + "\n" + "\n" + answer.srClickable.url.blue + "\nsubmitted: ".red + posted + " | ".red + up + answer.srClickable.ups + " | ".red + dwn + answer.srClickable.downs + " | author: ".red + answer.srClickable.author + " | subreddit: ".red + answer.srClickable.subredditName + "\n");
                                redditRun();
                            });
                        });
                    });
                });
            }
           
            // If users wants a subreddit and allow user to enter the name of the subreddit or choose from a list of popular subreddits 
            else if (answers.menu === 'SUBREDDIT' || answers.menu === 'SUBREDDITS') {

                function subMenu(type, callback){
                    if(type === 'SUBREDDIT') {
                        inquirer.prompt({
                            type: 'inputs',
                            name: 'subreddit',
                            message: 'Which subreddit do you want to browse?',
                        }).then(function (answer) {
                            var subrName = convertLower(answer.subreddit);
                            callback(subrName);
                        });
                    }
                    else if(type === 'SUBREDDITS') {
                        var srlArr = [];
                        reddit.getSubreddits(function(subRedList) {
                        subRedList.data.children.forEach(function(x, index) {
                            // build subreddit list array
                            srlArr.push(subRedList.data.children[index].data.display_name);
                        });
                        
                        // Show user a list of popular subreddits to choose from
                        inquirer.prompt({
                            type: 'list',
                            name: 'subreddits',
                            message: 'Choose from the list of popular subreddits',
                            choices: srlArr
                        }).then(function(answer) {
                            var subrName = convertLower(answer.subreddits);
                            callback(subrName);
                        });
                    });
                    }
                }

                subMenu(answers.menu, function(srAnswer){
                    console.log("You're browsing the " + "'".magenta + srAnswer.magenta + "'".magenta + " subreddit!\n");
                    reddit.getSubreddit(srAnswer, function(subRedName){
                        buildObj(subRedName, function(postObj) {
                            objToArr(postObj, function(postArr) {
                                inquirer.prompt({
                                    type: 'list',
                                    name: 'srClickable',
                                    message: 'Reddit Posts',
                                    choices: postArr
                                }).then(function(answer) {
                                    console.log('\033c');
                                    console.log(answer.srClickable.title.bold + "\n" + "\n" + answer.srClickable.url.blue + "\nsubmitted: ".red + posted + " | ".red + up + answer.srClickable.ups + " | ".red + dwn + answer.srClickable.downs + " | author: ".red + answer.srClickable.author + " | subreddit: ".red + answer.srClickable.subredditName + "\n");
                                    redditRun();
                                });
                                isEmpty(postObj, srAnswer, function(msg) {
                                    console.log(msg);
                                    redditRun();
                                });
                            });
                        });
                    });
                });
            }

            else {
                console.log(answers.menu);
                redditRun();
            }
        }
    );
}

console.log('\033c');
redditRun();