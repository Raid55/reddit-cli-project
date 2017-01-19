var request = require('request');

module.exports = function requestJson(url){
  return new Promise(function(resolve, reject) {
    request(url, function(err, result) {
      if (err) {
        reject(err);//this is the error
      }
      else {
        resolve(JSON.parse(result.body));// this is awnsers
      }
    })
  })
}
