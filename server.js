var express = require('express');
var request = require('request');
var crypto = require('crypto');
var q = require('q');
var cheerio = require('cheerio');
var app = express();

var createHash = function(string){
  return crypto.createHash('md5').update(string).digest("hex");
},
pickDomain = function(){
  var url = "http://api.temp-mail.ru/request/domains/format/json";
  var domain = q.defer();
    request(url, function(error, response, body){
      if(error){
        q.reject(error);
      }

      q.resolve(body[Math.floor(Math.random()*2)]);
    });
  };
};

generateEmail = function(){

},




requestEmailContents = function(hash){
  var urlBase = "http://api.temp-mail.ru/request/mail/id/";
  url = urlBase.concat(hash).concat("/format/json")
  var emailContents = q.defer();
  request(url, function(error, response,body){
    if(error){
      q.reject(error);
    }
    q.resolve(body)
  })

},
validateAccount = function

var parseEmail = function(email){
  $ = cheerio.load(email);
  $('href').each(function(i,element){
    validateAccount(element)
  }
}

varR


app.get('/', function (req, res) {
   res.send('Hello World');
});

var server = app.listen(8081, function () {
  console.log("Server Listening");
});
