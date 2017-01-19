var req = require('./request-as-json.js');

/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage() {
  return req('https://reddit.com/.json')
}


/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
  sortingMethod == "controversial" || sortingMethod == "top"){
      return req('https://reddit.com/'+sortingMethod+'.json')
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}



/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/

function getSubreddit(subreddit) {
  return req('https://reddit.com'+subreddit+'.json')
}



/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
  sortingMethod == "controversial" || sortingMethod == "top"){
      return req('https://reddit.com'+subreddit+'/'+sortingMethod+'.json')
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}



/*
This function should "return" all the popular subreddits
*/
function getSubreddits() {
  return req('https://reddit.com/subreddits.json')
}

function getArticle(permalink){
  console.log(`==================================================`)
  console.log('Loading: https://www.reddit.com'+permalink+'.json')
  console.log(`
    ------------///////PLS WAIT///////------------
    `)
  console.log(`==================================================`)
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
