var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: 'Mfr2N91xC1JJVWvcjthsM7j1X',
  consumer_secret: 'GMrRn4I691mVxiha6YGHp4Wn1RXfLmZIN53tRW8iqARg49uV1M',
  access_token_key: '285409171-uXwaLMhbpNmtm57qKcpq1lAOhhb1xDavU7hjsGol',
  access_token_secret: 'Gmeb7l8GYwbLy7xyB57hMn6cQjBLvBQLP3m6co2epRLu9'
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("data query :",req.query);
  var params = {screen_name: 'Filelouch'};
  /*client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      res.send(tweets);
    }
  });*/
  client.get('favorites/list',params, function(error, tweets, response) {
    if(error){

      console.log(tweets);  // The favorites.
      console.log(response);  // Raw response object.

      res.send({tweets:tweets,response:response});
    }else{
      throw error;
    }
  });
  // var users = {
  //   user1: req.query.var1,
  //   user2: req.query.var2
  // }
  // res.send(users);
});

module.exports = router;
