var inquirer = require('inquirer');
var fetchRed = require('./lib/reddit.js');
var Table = require('cli-table');

/*
.catch(function(err){
  console.log("a problem haz happen", err)
})
*/
//RENEGADE FUNCTIONS////////////////////////////////////////////
function addNewlines(str) {
  var result = '';
  while (str.length > 0) {
    result += str.substring(0, 200) + '\n';
    str = str.substring(200);
  }
  return result;
}

function makeTopicList(subred){
  var articleList;
  var nextP;
  fetchRed.getSubreddit(subred)
  .then(function(res){
    nextP = res.data.after
    articleList = res.data.children.reduce(function(accu,el,indx){
      accu.push({name: el.data.title ,value: 'MEMEBALLS'})
      return accu;
    },[])
    return res
  })
  // .then(function(res){
  //   nextP = [{name: nextP,value: 'itaWORKS'}]
  // })
  .then(function(res){
    inquirer.prompt({
      type: 'list',
      name: 'redditList',
      message: 'What do you want to do?',
      choices: articleList
    }).then(
      function(res) {
        res.articleList
      }
    );
  });
}


function makeSubredditInq(){
  var redditList;
  fetchRed.getSubreddits()
  .then(function(res){
    redditList =res.data.children.reduce(function(accu,el,indx){
      accu.push({name: el.data.url ,value: makeTopicList})
      return accu;
    },[])
    return res
  })
  .then(function(res){
    inquirer.prompt({
      type: 'rawlist',
      name: 'redditList',
      message: 'What do you want to do?',
      choices: redditList
    }).then(
      function(res) {
        console.log(res.redditList);
      }
    );
  })
}
////////////////////////////////////////////////////////////////

//
// fetchRed.getHomepage().then(function(res){
//   console.log(res.data.children[0])
// })
var redditList = makeSubredditInq()

var start = [
  {name: 'Show homepage', value: 'HOMEPAGE'},
  {name: 'Custom subreddit', value: 'lolol'},
  {name: 'List subreddits', value: makeSubredditInq}
];

inquirer.prompt({
  type: 'list',
  name: 'start',
  message: 'What do you want to do?',
  choices: start
}).then(
  function(res) {
    res.start()
  }
);
