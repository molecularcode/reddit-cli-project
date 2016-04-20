// import my reddit module file
var reddit = require("./lib/reddit.js");

// > npm install inquirer, colors, util
var inquirer = require('inquirer');
var colors = require('colors');
var util = require('util');

//console.log(util.inspect(reddit, { showHidden: true, depth: 3, colors: true }));

/* Basic feature: the main menu
--------------------------------------------------------------------------------------- */
//  When the user chooses the homepage option, you should display the list of posts from the getHomepage function you created previously. For each post, list at least some of the info that appears on reddit: title, url, votes, username. After the list of posts is displayed, you should display the main menu again.

var menuChoices = [
  {name: 'Show reddit homepage', value: 'HOMEPAGE'},
  {name: 'Show subreddit', value: 'SUBREDDIT'},
  {name: 'List subreddits', value: 'SUBREDDITS'}
];

inquirer.prompt({
  type: 'list',
  name: 'menu',
  message: 'What do you want to browse?',
  choices: menuChoices
}).then(
  function(answers) {
    console.log(answers);
  }
);