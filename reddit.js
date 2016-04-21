/*  Basic feature: the main menu
--------------------------------------------------------------------------------------- */
//  When the user chooses the homepage option, you should display the list of posts from the getHomepage function you created previously. For each post, list at least some of the info that appears on reddit: title, url, votes, username. After the list of posts is displayed, you should display the main menu again.


/*  Basic feature: subreddit posts
--------------------------------------------------------------------------------------- */
//  When the user chooses the subreddit posts option, you should ask him -- again using inquirer -- which subreddit he wants to see. Then, display the list of posts in the same way as the homepage.

// import my reddit module file
var reddit = require("./lib/reddit.js");

// > npm install inquirer, colors, util
var inquirer = require('inquirer');
var colors = require('colors');
var emoji = require('node-emoji');
var util = require('util');
var currentTime = Math.floor(new Date().getTime() / 1000); // in seconds
var up = emoji.get('thumbsup').green;
var dwn = emoji.get('thumbsdown').red;


// Menu
var menuChoices = [
    {name: 'Show reddit homepage', value: 'HOMEPAGE'},
    {name: 'Show subreddit', value: 'SUBREDDIT'},
    {name: 'List subreddits', value: 'SUBREDDITS'}
];

function redditRun() {
    inquirer.prompt({
      type: 'list',
      name: 'menu',
      message: 'What do you want to browse?',
      choices: menuChoices
    }).then(function(answers) {
            if (answers.menu === 'HOMEPAGE') {
                reddit.getHomepage(function(result){
                    var hpObj = {};
                    var posted;
                    result.data.children.forEach(function(x, index) {
                        // build homepage object
                        hpObj[result.data.children[index].data.id] = {
                            title:result.data.children[index].data.title,
                            url:result.data.children[index].data.url,
                            ups:result.data.children[index].data.ups,
                            downs:result.data.children[index].data.downs,
                            author:result.data.children[index].data.author,
                            created:result.data.children[index].data.created_utc
                        };
                    });
    
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
    
                    for(var prop in hpObj) {
                        postedTime(hpObj[prop].created, currentTime);
                        console.log(hpObj[prop].title.bold + "\n" + hpObj[prop].url.blue + "\nsubmitted: ".red + posted + " | ".red + up + hpObj[prop].ups + " | ".red + dwn + hpObj[prop].downs + " | author: ".red + hpObj[prop].author + "\n");
                    }
                    console.log(redditRun());
                });
            }
            else if(answers.menu === 'SUBREDDIT') {
                
            }
            else {
                console.log(answers.menu);
                console.log(redditRun());
            }
        }
    );
}

redditRun();