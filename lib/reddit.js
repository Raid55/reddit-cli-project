var req = require('./request-as-json.js');

const red = 'https://reddit.com';

function getHomepage() {
  return req(red+'/.json')
}

function getSortedHomepage(sortingMethod) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
  sortingMethod == "controversial" || sortingMethod == "top"){
      return req(red+'/'+sortingMethod+'.json')
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}

function getSubreddit(subreddit) {
  return req(red+subreddit+'.json')
}

function getSortedSubreddit(subreddit, sortingMethod) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
  sortingMethod == "controversial" || sortingMethod == "top"){
      return req(red+subreddit+'/'+sortingMethod+'.json')
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}

function getSubreddits() {
  return req(red+'/subreddits.json')
}

function getArticle(permalink){
  console.log(`=========================================================================================`)
  console.log('Loading: '+red+permalink+'.json')
  console.log(`
              ------------///////PLS WAIT///////------------
    `)
  console.log(`=========================================================================================`)
  return req(red+permalink+'.json')
}

function nextPage(pageid,subreddit){
  if(subreddit){
    return req(red+subreddit+'.json?count=25&after='+pageid)
  }else{
    return req(red+'/.json?count=25&after='+pageid)
  }
}


// Export the API
module.exports = {
  getSubreddits: getSubreddits,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddit: getSubreddit,
  getSortedHomepage: getSortedHomepage,
  getHomepage: getHomepage,
  getArticle: getArticle,
  nextPage: nextPage,
};
