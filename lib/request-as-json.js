var request = require('request');

module.exports = function requestJson(url,callback){
  request(url, function (error, response) {
    if (!error && response.statusCode == 200) {
      try{
        callback(null,JSON.parse(response.body));
      }
      catch(err){
        console.log("an error was caught red handed")
        callback(err,null)
        return;
      }

    }else{
      callback(error,null)
    }
  })
}
