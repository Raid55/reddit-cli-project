var req = require('./request-as-json.js');

/*
This function should "return" the default homepage posts as an array of objects
*/
function getHomepage(callback) {
  req('https://reddit.com/.json', function(err, res) {
    if (!err) {
      try {
        callback(null, res.data.children);
      }
      catch(err) {
        callback(err);
      }
    }else{
      callback(err);
    }
  });
}


/*
This function should "return" the default homepage posts as an array of objects.
In contrast to the `getHomepage` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedHomepage(sortingMethod, callback) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
   sortingMethod == "controversial" || sortingMethod == "top"){
    req('https://reddit.com/'+sortingMethod+'.json', function(err, res) {
      if (!err) {
        try {
          callback(null, res.data.children);
        }
        catch(err) {
          callback(err);
        }
      }else{
        callback(err);
      }
    });
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
*/
function getSubreddit(subreddit, callback) {
  req('https://reddit.com/r/'+subreddit+'.json', function(err, res) {
    if (!err) {
      try {
        callback(null, res.data.children);
      }
      catch(err) {
        callback(err);
      }
    }else{
      callback(err);
    }
  });
}

/*
This function should "return" the posts on the front page of a subreddit as an array of objects.
In contrast to the `getSubreddit` function, this one accepts a `sortingMethod` parameter.
*/
function getSortedSubreddit(subreddit, sortingMethod, callback) {
  if(sortingMethod == "hot" || sortingMethod == "new" || sortingMethod == "rising" ||
   sortingMethod == "controversial" || sortingMethod == "top"){
    req('https://reddit.com/r/'+subreddit+'/'+sortingMethod+'.json', function(err, res) {
      if (!err) {
        try {
          callback(null, res.data.children);
        }
        catch(err) {
          callback(err);
        }
      }else{
        callback(err);
      }
    });
  }else{
    console.log(sortingMethod+" is not a sorting method")
  }
}

/*
This function should "return" all the popular subreddits
*/
function getSubreddits(callback) {
  req('https://reddit.com/subreddits.json', function(err, res) {
    if (!err) {
      try {
        callback(null, res.data.children);
      }
      catch(err) {
        callback(err);
      }
    }else{
      callback(err);
    }
  });
}

// Export the API
module.exports = {
  getSubreddits: getSubreddits,
  getSortedSubreddit: getSortedSubreddit,
  getSubreddit: getSubreddit,
  getSortedHomepage: getSortedHomepage,
  getHomepage: getHomepage
};
