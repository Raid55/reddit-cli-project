var req = require('./request-as-json.js');


function getHomepage() {
  return req('https://reddit.com/.json')
}

function getSortedHomepage(sortingMethod) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
  sortingMethod == "controversial" || sortingMethod == "top"){
      return req('https://reddit.com/'+sortingMethod+'.json')
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}

function getSubreddit(subreddit) {
  return req('https://reddit.com'+subreddit+'.json')
}

function getSortedSubreddit(subreddit, sortingMethod) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
  sortingMethod == "controversial" || sortingMethod == "top"){
      return req('https://reddit.com'+subreddit+'/'+sortingMethod+'.json')
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}

function getSubreddits() {
  return req('https://reddit.com/subreddits.json')
}

function getArticle(permalink){
  console.log(`=========================================================================================`)
  console.log('Loading: https://www.reddit.com'+permalink+'.json')
  console.log(`
              ------------///////PLS WAIT///////------------
    `)https://www.reddit.com/r/GlobalOffensive/comments/5owcl3/eseas_decision_to_promote_teams_based_on/.json
  console.log(`=========================================================================================`)
  return req('https://www.reddit.com'+permalink+'.json')
}

function nextPage(pageid){
  return req('https://www.reddit.com/.json?after='+pageid)
}

// Export the API
module.exports = {
  getSubreddits: getSubreddits,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddit: getSubreddit,
  getSortedHomepage: getSortedHomepage,
  getHomepage: getHomepage,
  getArticle: getArticle,
  nextPage: nextPage
};
