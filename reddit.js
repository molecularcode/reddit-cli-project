/*  1 - Basic feature: the main menu
--------------------------------------------------------------------------------------- */
//  When the user chooses the homepage option, you should display the list of posts from the getHomepage function you created previously. For each post, list at least some of the info that appears on reddit: title, url, votes, username. After the list of posts is displayed, you should display the main menu again.


/*  2 - Basic feature: subreddit posts
--------------------------------------------------------------------------------------- */
//  When the user chooses the subreddit posts option, you should ask him -- again using inquirer -- which subreddit he wants to see. Then, display the list of posts in the same way as the homepage.

/*  3 - Feature: list of subreddits *
--------------------------------------------------------------------------------------- */
//  When the user chooses the list of subreddits option, you should load the list of subreddits using the getSubreddits function you created previously. Then, using inquirer, show the list of subreddits to the user. The user will be able to choose a subreddit to display its posts, or go back to the main menu. You can use an Inquirer Separator to create a visual separation between the list of subreddits and the "go back to main menu" option.


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
function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true && JSON.stringify(obj) === JSON.stringify({});
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
            // If user wants Homepage
            if (answers.menu === 'HOMEPAGE') {
                reddit.getHomepage(function(result){
                    var hpObj = {};
                    result.data.children.forEach(function(x, index) {
                        // build homepage object
                        hpObj[result.data.children[index].data.id] = {
                            title:result.data.children[index].data.title,
                            url:result.data.children[index].data.url,
                            ups:result.data.children[index].data.ups,
                            downs:result.data.children[index].data.downs,
                            author:result.data.children[index].data.author,
                            created:result.data.children[index].data.created_utc,
                            subredditName:result.data.children[index].data.subreddit
                        };
                    });

                    for(var prop in hpObj) {
                        postedTime(hpObj[prop].created, currentTime);
                        console.log(hpObj[prop].title.bold + "\n" + hpObj[prop].url.blue + "\nsubmitted: ".red + posted + " | ".red + up + hpObj[prop].ups + " | ".red + dwn + hpObj[prop].downs + " | author: ".red + hpObj[prop].author + " | subreddit: ".red + hpObj[prop].subredditName + "\n");
                    }
                    console.log(redditRun());
                });
            }
            
            // If users wants a subreddit and allow user to enter the name of the subreddit or choose from a list of popular subreddits
            else if(answers.menu === 'SUBREDDIT' || answers.menu === 'SUBREDDITS') {

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
                        //console.log(srlArr);
                        
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
                    console.log("You are browsing the " + srAnswer + " subreddit!\n");
                    reddit.getSubreddit(srAnswer, function(subRedName){
                
                        var srObj = {};
                        subRedName.data.children.forEach(function(x, index) {
                            // build subreddit object
                            srObj[subRedName.data.children[index].data.id] = {
                                title:subRedName.data.children[index].data.title,
                                url:subRedName.data.children[index].data.url,
                                ups:subRedName.data.children[index].data.ups,
                                downs:subRedName.data.children[index].data.downs,
                                author:subRedName.data.children[index].data.author,
                                created:subRedName.data.children[index].data.created_utc,
                                subredditName:subRedName.data.children[index].data.subreddit
                            };
                        });
        
                        for(var prop in srObj) {
                            postedTime(srObj[prop].created, currentTime);
                            console.log(srObj[prop].title.bold + "\n" + srObj[prop].url.blue + "\nsubmitted: ".red + posted + " | ".red + up + srObj[prop].ups + " | ".red + dwn + srObj[prop].downs + " | author: ".red + srObj[prop].author + " | subreddit: ".red + srObj[prop].subredditName + "\n");
                        }
                        // Error msg for if the subreddit name entered by the user doesn't exist
                        if (isEmpty(srObj) === true) {
                            console.log("Sorry, " + srAnswer + " is not actually a subreddit, please enter a different subreddit or try choosing from the list of popular subreddits in the menu below.\n");
                        }
                        redditRun();
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

redditRun();