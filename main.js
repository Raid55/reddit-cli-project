var inquirer = require('inquirer');
var fetchRed = require('./lib/reddit.js');
var Table = require('cli-table');

/*
.catch(function(err){
  console.log("a problem haz happen", err)
})
*/

//small process functions...
function getTitlesAndPermalinks(res){
  nextP = res.data.after
  articleList = res.data.children.reduce(function(accu,el,indx){
    accu.push({name: el.data.title ,value: el.data.permalink})
    return accu;
  },[])
  return res
}

function pushArticlesToList(res){
  articleList.push(new inquirer.Separator())
  articleList.push({name: 'Next Page' ,value: nextPage})
  articleList.push(new inquirer.Separator())
  return res
}

function checkIfArticleAndPassAlong(res) {
    if(res.articles == nextPage){
       return res.articles(nextP)
    }
    return fetchRed.getArticle(res.articles)
}

function getArticle(res){
  return res.reduce(function(accu,el,indx){
    if(indx === 0){
      accu.push(el.data.children[0].data)
    }
    return accu
  },[])
}

function displayArticle(res){
  if(res[0].post_hint){
    console.log(`=============================================================================`)
    console.log('it was an image, images arent suported yet... or a link which is: ')
    console.log(res[0].url)
    console.log(`=============================================================================`)
  }else{
    var table = new Table({
        head: ['Username/Votes',res[0].title]
      , colWidths: [30,125]
    });
    table.push(
        [res[0].author+' / '+res[0].score, res[0].selftext]
    );
    console.log(res[0].selftext)
    console.log(table.toString());
  }
}

function askWhatNowAndDo(res){
  inquirer.prompt({
    type: 'list',
    name: 'next',
    message: 'What now?',
    choices: whatNext
  })
  .then(function(res){
    if(res.next == startOver){
      res.next()
    }else{
      res.next(articleList,nextP)
    }
  })
}

//big control flow function
// .......................
function askWhatArticleToReadAndWhatDoNext(res){
  inquirer.prompt({
    type: 'list',
    name: 'articles',
    message: 'Which artile do you wish to read?',
    choices: articleList
  })
  .then(checkIfArticleAndPassAlong)
  .then(getArticle)
  .then(displayArticle)
  .then(askWhatNowAndDo)
}


//RENEGADE FUNCTIONS////////////////////////////////////////////
// function addNewlines(str) {
//   var result = '';
//   while (str.length > 0) {
//     result += str.substring(0, 200) + '\n';
//     str = str.substring(200);
//   }
//   return result;
// }



function makeTopicList(subred){
  var articleList;
  var nextP;
  fetchRed.getSubreddit(subred)
  .then(getTitlesAndPermalinks)
  .then(pushArticlesToList)
  .then(askWhatArticleToReadAndWhatDoNext)
  .catch(function(err){
    console.log('Error 55', err)
    startOver()
  })
}

function makeTopicListforHome(){
  var articleList;
  var nextP;
  fetchRed.getHomepage()
  .then(getTitlesAndPermalinks)
  .then(pushArticlesToList)
  .then(askWhatArticleToReadAndWhatDoNext)
  .catch(function(err){
    console.log('Error 55', err)
    startOver()
  })
}

function nextPage(pageid){
  var articleList;
  var nextP;
  fetchRed.nextPage(pageid)
  .then(getTitlesAndPermalinks)
  .then(pushArticlesToList)
  .then(askWhatArticleToReadAndWhatDoNext)
  .catch(function(err){
    console.log('Error 55', err)
    startOver()
  })
}


function goBack(articlArray,pageid){
  var articleList = articlArray;
  var nextP = pageid;
  inquirer.prompt({
    type: 'list',
    name: 'articles',
    message: 'Which artile do you wish to read?',
    choices: articleList
  })
  .then(checkIfArticleAndPassAlong)
  .then(getArticle)
  .then(displayArticle)
  .then(askWhatNowAndDo)
  .catch(function(err){
    console.log('Error 55', err)
    startOver()
  })
}


function makeSubredditInq(){
  var redditList;
  fetchRed.getSubreddits()
  .then(function(res){
    redditList =res.data.children.reduce(function(accu,el,indx){
      accu.push({name: el.data.url ,value: el.data.url})
      return accu;
    },[])
    return res
  })
  .then(function(res){
    inquirer.prompt({
      type: 'list',
      name: 'returnList',
      message: 'Which subreddit do you want to open?',
      choices: redditList
    }).then(
      function(res) {
        makeTopicList(res.returnList);
      }
    );
  })
}

function askForCustomSub(){
  inquirer.prompt({
    type: 'input',
    name: 'response',
    message: 'Which Subreddit would you like to browse?(Cap sensitive/in this format: /r/whatever_sub/)',
  })
  .then(
    function(res) {
      console.log(res.response)
      makeTopicList(res.response)
    }
  );
}


////////////////////////////////////////////////////////////////

//
// fetchRed.getHomepage().then(function(res){
//   console.log(res.data.children[0])
// })
// var redditList = makeSubredditInq()

//WHAT NEXT MENUE///////////////////////////////////////////////////////////////////////
var whatNext = [
  {name: 'Go back', value: goBack},
  new inquirer.Separator(),
  {name: 'Start Over', value: startOver}
]

//START MENUE///////////////////////////////////////////////////////////////////////////
var start = [
  {name: 'Show homepage', value: makeTopicListforHome},
  {name: 'Custom subreddit', value: askForCustomSub},
  {name: 'List subreddits', value: makeSubredditInq}
];

function startOver(){
  inquirer.prompt({
    type: 'list',
    name: 'start',
    message: 'What do you want to do?',
    choices: start
  })
  .then(
    function(res) {
      res.start()
    }
  );
}

startOver()
