var express = require('express');
var request = require('request');
request = request.defaults({
  jar: true
});
var crypto = require('crypto');
var q = require('q');
var cheerio = require('cheerio');
var random = require("random-name");

var app = express();
var createHash = function(word) {
    return crypto.createHash('md5').update(word).digest("hex");
  },
  pickDomain = function() {
    var url = "http://api.temp-mail.ru/request/domains/format/json";
    var domain = q.defer();
    request(url, function(error, response, body) {
      if (error) {
        domain.reject(error);
      }
      domain.resolve(body[Math.floor(Math.random() * 2)]);
    });
    return domain.promise;
  },


  generateEmail = function(username) {
    var email = q.defer();
    pickDomain().then(function(result) {
      email.resolve(username.concat(result));
    }).catch(errpr, function(error) {
      email.reject(error);
    });
    return email.promise;
  },
  generateUsername = function() {
    return username = random.first().concat(random.middle())
      .concat(random.last()).concat(Math.floor(Math.random() * 9999));
  },
  generateDob = function() {
    var year = Math.floor(Math.random * 40 + 1950),
      month = Math.floor(Math.random * 11 + 1),
      day = Math.floor(Math.random * 27);
    return year.concat('-').concat(day).concat('-').concat(month);
  },
  generatePost = function(username, email) {
    account = {
      username: username,
      password: createHash('THIS$^#TISMOTHERF&CK&#GDOPE'),
      gender: ['M', 'F'][Math.floor(Math.random())],
      dateOfBirth: generateDob(),
      email: email,
      experience: "LegoCom",
      countryCode: "US",
      tosVersion: "enusXX01",
      returnURL: "https://ideas.lego.com/projects/132444"
    };
    return post;
  },

  generateAccount = function() {
    var account = q.defer(),
      name = generateUsername();
    generateEmail().then(function(email) {
      account.resolve(function() {
        generatePost(name, email);
      });
    }).catch(function(error) {
      account.reject(error);
    });
    return account.promise;
  },


  submitAccount = function() {
    var submit = q.defer();
    generateAccount().then(function(post) {
      var options = {
        method: 'POST',
        url: 'https://account2.lego.com/account/en-us/account/',
        headers: {
          'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
        },
        formData: post
      };
      request(options, function(error, res, body) {
        if (error || !(body.success)) {
          submit.reject(error);
        }
        submit.resolve(post.email);
      });
    }).catch(function(error) {
      submit.reject(error);
    });
    return submit.promise;
  },

  requestEmailContents = function(hash) {
    var urlBase = "http://api.temp-mail.ru/request/mail/id/";
    url = urlBase.concat(hash).concat("/format/json");
    var emailContents = q.defer();
    request(url, function(error, response, body) {
      if (error) {
        emailContents.reject(error);
      }
      emailContents.resolve(body);
    });
    return emailContents.promise;
  },
  clickLink = function(url) {
    var validate = q.defer();
    request(url, function(error, response, body) {
      if (error) {
        q.reject(error);
      }
      q.resolve();
    });
    return validate.promise;

  },
  parseEmail = function(email) {
    var $ = cheerio.load(email);
    $('href').each(function(i, element) {
      return element.val();
    });

  },
  validateAccount = function(email) {
    var validate = q.defer();
    requestEmailContents(createHash(email)).then(function(data) {
      clickLink(parseEmail(data)).then(function(result) {
        validate.resolve();
      }).catch(function(error) {
        validate.reject(error);
      });
    });
    return validate.promise;
  },
  create2ndAccount = function() {
    var account2 = q.defer();
    var options = {
      method: 'POST',
      url: 'https://ideas.lego.com/l/registration/new_account',
      headers: {
        'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
      },
      formData: {
        agree_to_terms: 'y'
      }
    };
    request(options, function(error, res, body) {
      if (error) {
        account2.reject(error);
      }
      account2.resolve();
    });
    return account2.promise;
  },
  submitVote = function() {
    var vote = q.defer();
    var options = {
      method: 'POST',
      url: 'https://ideas.lego.com/projects/132444/support?_=1467082847056',
      formData: {
        cost: '$10 - 49',
        number_to_buy: '2',
        demographics_teenagers: 'y',
        demographics_adults: 'y',
        difficulty: 'Medium'
      }
    };
    request(options, function(error, res, body){
      if(error){
        vote.reject(error);
      }
      vote.resolve();
    });

    return vote.promise;
  },
  main = function() {
    console.log("We going for it");
    submitAccount.then(function(email) {
      validateAccount(email).then(function() {
        create2ndAccount().then(function(){
          submitVote().then(function(){
            console.log("Successfully Voted");
          });
        });
      });
    }).catch(function(error) {
      console.log(error + 'WHY NO PERFECT');
    });
  };

main();
app.get('/', function(req, res) {
  res.send('Hello World');
});

var server = app.listen(8081, function() {
  console.log("Server Listening");
});
