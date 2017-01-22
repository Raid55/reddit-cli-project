var inquirer = require('inquirer');
var fetchRed = require('./lib/reddit.js');
var Table = require('cli-table');
var fs = require('fs');

/*
.catch(function(err){
  console.log("a problem haz happen", err)
})
*/

//small process functions...
function getTitlesAndPermalinks(res){
  nextP = res.data.after
  beforeP = res.data.before
  articleList = res.data.children.reduce(function(accu,el,indx){
    accu.push({name: el.data.title ,value: el.data.permalink})
    return accu;
  },[])
  return res
}

function pushArticlesToList(res){
  articleList.push(new inquirer.Separator())
  articleList.push({name: 'Next Page**OUT OF ORDER**' ,value: nextPage})
  articleList.push(new inquirer.Separator())
  return res
}

function checkIfArticleAndPassAlong(res) {
    // if(res.articles == nextPage){
    //    return res.articles(nextP,subred)
    // }
    return fetchRed.getArticle(res.articles)
}

function getArticle(res){
  comments = res[1].data.children
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
    console.log('it was an image/link, images/links arent suported yet... The link was: ')
    console.log(res[0].url)
    console.log(`=============================================================================`)
  }else{
    var cols = 125;
    var table = new Table({
        head: ['Username / Votes',res[0].title]
      , colWidths: [30, cols]
    });
    var formattedText = formatToXCols(res[0].selftext)
    table.push(
        [res[0].author+' / '+res[0].score, formattedText]
    );
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
    }else if(res.next == loadComments){
      res.next(comments)
    }else{
      res.next(articleList,nextP)
    }
    return res
  })
  .then(function(res){
    inquirer.prompt({
      type: 'list',
      name: 'next',
      message: 'What now?',
      choices: whatNextwithoutload
    })
    .then(function(res){
      if(res.next == startOver){
        res.next()
      }else{
        res.next(articleList,nextP)
      }
    })
  })
  .catch(function(err){
    console.log(err,"error FiddyFive")
    startOver()
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
  .then(function(res){
    if(res.articles == nextPage){
      return res.articles(nextP,sub)
    } else {
      return res
    }
  })
  .then(checkIfArticleAndPassAlong)
  .then(getArticle)
  .then(displayArticle)
  .then(askWhatNowAndDo)
  .catch(function(err){
    console.log(err,"error FiddyFive")
    startOver()
  })
}


//Comment Section////////////////////////////////////////////

function reduceComments(arr){
  return arr.reduce(function(accu,el,indx){
    if(el.data.replies === ''){
      accu.push(el.data.author+": "+el.data.body)
    } else{
      accu.push(el.data.author+": "+el.data.body, reduceComments(el.data.replies.data.children))
    }
    return accu
  },[])
}

function loadComments(comments){
  commentsArr = comments.reduce(function(accu,el,indx){
    if(el.data.replies === ''){
      accu.push(el.data.author+": "+el.data.body)
    } else{
      accu.push(el.data.author+": "+el.data.body,reduceComments(el.data.replies.data.children))
    }
    return accu
  },[])
  printComments(commentsArr, 0)
  // console.dir(commentsArr, { depth: null })
}

function returnSpaceCount(count) {
  var spaces = "";
  for (var i=0; i<count; i++) {
    spaces += "   |";
  }
  return spaces;
}

function printComments(array, count){
  array.forEach(function(el,indx,arr){
    if(typeof el === 'string'){
      console.log(returnSpaceCount(count) + formatToXColsforCom(el,count))
      console.log("-----------------------------------------------------------------------------------------------------------------------")
    } else {
      printComments(el, count+1)
    }
  })
}

function formatToXColsforCom(text,counts) {
  var count = 0;
  var newStr = ""
  for(var i=0; i<text.length; i++, count++) {
    if(text.charAt(i) === "\n" ) {
      count = 0;
    }
    if(count === 118) {
      newStr += '-\n'+returnSpaceCount(counts);
      count = 0;
    }
    newStr += text.charAt(i)
  }
  return newStr
}

/////////////////////////////////////////////

function formatToXCols(text) {
  var count = 0;
  var newStr = ""
  for(var i=0; i<text.length; i++, count++) {
    if(text.charAt(i) === "\n") {
      count = 0;
    }
    if(count === 118) {
      newStr += '-\n';
      count = 0;
    }
    newStr += text.charAt(i)
  }
  return newStr
}
//////////////////////////////////////////////////////////////////////

function makeTopicList(subred,sort){
  var articleList;
  var nextP;
  var beforeP;
  var comments;
  var sub = subred;
  fetchRed.getSortedSubreddit(subred,sort)
  .then(getTitlesAndPermalinks)
  .then(pushArticlesToList)
  .then(askWhatArticleToReadAndWhatDoNext)
  .catch(function(err){
    console.log(err,'Error 55')
    startOver()
  })
}

function makeTopicListforHome(sort){
  var articleList;
  var nextP;
  fetchRed.getSortedHomepage(sort)
  .then(getTitlesAndPermalinks)
  .then(pushArticlesToList)
  .then(askWhatArticleToReadAndWhatDoNext)
  .catch(function(err){
    console.log(err,'Error 55')
    startOver()
  })
}

function nextPage(pageid,subreddit){
  var articleList;
  var nextP;
  var beforeP;
  fetchRed.nextPage(pageid,subreddit)
  .then(getTitlesAndPermalinks)
  .then(pushArticlesToList)
  .then(askWhatArticleToReadAndWhatDoNext)
  .catch(function(err){
    console.log(err,'Error 55')
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
    console.log(err,'Error 55')
    startOver()
  })
}


function makeSubredditInq(){
  var redditList;
  var subred;
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
    })
    .then(function(res){
      subred = res.returnList
      return res
    })
    .then(function(res){
      inquirer.prompt({
        type: 'list',
        name: 'sort',
        message: 'How should I sort them?',
        choices: sortList
      })
      .then(function(res){
          makeTopicList(subred,res.sort);
      })
    })
  })
}


function askForCustomSub(){
  var subred;
  inquirer.prompt({
    type: 'input',
    name: 'response',
    message: 'Which Subreddit would you like to browse?(Cap sensitive/in this format: /r/whatever_sub/)',
  })
  .then(function(res){
    subred = res.response
    return res
  })
  .then(function(res){
    inquirer.prompt({
      type: 'list',
      name: 'sort',
      message: 'How should I sort them?',
      choices: sortList
    })
    .then(function(res){
        makeTopicList(subred,res.sort);
    })
  })
}

function favList(){
  var favredditlist = fs.readFileSync('./reddit_profiles.json')
  var favredditlist = JSON.parse(favredditlist)
  var subred;
  inquirer.prompt({
    type: 'list',
    name: 'fav',
    message: 'Which one will it be today?',
    choices: favredditlist
  })
  .then(function(res){
    subred = res.fav
    return res
  })
  .then(function(res){
    inquirer.prompt({
      type: 'list',
      name: 'sort',
      message: 'How should I sort them?',
      choices: sortList
    })
    .then(function(res){
        makeTopicList(subred,res.sort);
    })
  })
}
/////////////////////////////////////////////////////////////////////////////////////////

///FS FUNCTIONS/////////////////////////////////////////////////////////////////////////
function remvFavReddits(){
  var profile = fs.readFileSync('./reddit_profiles.json')
  var profile = JSON.parse(profile)
  inquirer.prompt({
    type: 'checkbox',
    name: 'remv',
    message: 'What do you want to remove?',
    choices: profile
  })
  .then(function(res) {
      profile = profile.filter(function(el) {
        return res.remv.indexOf(el.value) === -1;
      });
      return res
    }
  )
  .then(function(res){
    for(var i = 0;i<res.remv.length;i++){
      console.log(res.remv[i]+ ' has been removed')
    }
    fs.writeFileSync("./reddit_profiles.json", JSON.stringify(profile))
    return res
  })
  .then(function(res){
    console.log('Done!')
    inquirer.prompt({
      type: 'list',
      name: 'next',
      message: 'What do you want to do?',
      choices: whatNextforMiniDB
    })
    .then(function(res) {
      res.next()
    })
  })
}

function addToFavs(){
  var profile = fs.readFileSync('./reddit_profiles.json')
  var profile = JSON.parse(profile)
  inquirer.prompt({
    type: 'input',
    name: 'add',
    message: 'Which subreddit would you like to add?(Caps sensitive & ex. /r/GlobalOffensive/):'
  })
  .then(function(res) {
    profile.push({name: res.add,value: res.add})
    return res
  })
  .then(function(res){
    console.log(res.add+ ' has been added')
    fs.writeFileSync("./reddit_profiles.json", JSON.stringify(profile))
    return res
  })
  .then(function(res){
    console.log('Done!')
    inquirer.prompt({
      type: 'list',
      name: 'next',
      message: 'What do you want to do?',
      choices: whatNextforMiniDB
    })
    .then(function(res) {
      res.next()
    })
  })
}

//WHAT NEXT MENUE///////////////////////////////////////////////////////////////////////
var sortList =[
  {name: 'Hot', value: "hot"},
  {name: 'New', value: "new"},
  {name: 'Rising', value: "rising"},
  {name: 'Controversial', value: "controversial"},
  {name: 'Top', value: "top"},
]

var whatNextforMiniDB =[
  {name: 'Add a subreddit', value: addToFavs},
  {name: 'Remove a subreddit', value: remvFavReddits},
  new inquirer.Separator(),
  {name: 'Go back to Start Menu', value: startOver}
]

var whatNextwithoutload = [
  {name: 'Go back', value: goBack},
  new inquirer.Separator(),
  {name: 'Start Over', value: startOver}
]

var whatNext = [
  {name: 'Load Comments', value: loadComments},
  new inquirer.Separator(),
  {name: 'Go back', value: goBack},
  new inquirer.Separator(),
  {name: 'Start Over', value: startOver}
]

//START MENUE///////////////////////////////////////////////////////////////////////////
var start = [
  {name: 'Show homepage', value: makeTopicListforHome},
  {name: 'Custom subreddit', value: askForCustomSub},
  {name: 'List populair subreddits', value: makeSubredditInq},
  {name: 'My subredits', value: favList},
  new inquirer.Separator(),
  {name: 'Add to my subreddits', value: addToFavs},
  {name: 'Remove from my subreddits', value: remvFavReddits}
];

function startOver(){
  inquirer.prompt({
    type: 'list',
    name: 'start',
    message: 'What do you want to do?',
    choices: start
  })
  .then(function(res) {
      if(res.start == makeTopicListforHome){
        inquirer.prompt({
          type: 'list',
          name: 'sort',
          message: 'How should I sort them?',
          choices: sortList
        })
        .then(function(res){
            makeTopicListforHome(res.sort);
        })
      }else{
      res.start()
      }
    }
  );
}

startOver()
