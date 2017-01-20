var fs = require('fs');
var inquirer = require('inquirer');



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
      console.log(profile)
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
  })
}

module.exports = {
  add: addToFavs,
  remove: remvFavReddits
}
