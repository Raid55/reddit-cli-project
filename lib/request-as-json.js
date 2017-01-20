var request = require('request');

module.exports = function requestJson(url){
  return new Promise(function(resolve, reject) {
    request(url, function(err, res) {
      if (!err && res.statusCode == 200) {
        // console.log(JSON.parse(res.body))
        resolve(JSON.parse(res.body));// this is awnsers
      }
      else {
        console.log(err,'ERROR,ERROR, check if there was an apostrophy in link')
        reject(err);//this is the error
      }
    })
  })
}
