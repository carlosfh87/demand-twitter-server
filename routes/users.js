var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var Twit = require('twit')

var client = new Twitter({
  consumer_key: 'Mfr2N91xC1JJVWvcjthsM7j1X',
  consumer_secret: 'GMrRn4I691mVxiha6YGHp4Wn1RXfLmZIN53tRW8iqARg49uV1M',
  access_token_key: '285409171-uXwaLMhbpNmtm57qKcpq1lAOhhb1xDavU7hjsGol',
  access_token_secret: 'Gmeb7l8GYwbLy7xyB57hMn6cQjBLvBQLP3m6co2epRLu9'
});

var client_2 = new Twit({
  consumer_key:         'Mfr2N91xC1JJVWvcjthsM7j1X',
  consumer_secret:      'GMrRn4I691mVxiha6YGHp4Wn1RXfLmZIN53tRW8iqARg49uV1M',
  access_token:         '285409171-uXwaLMhbpNmtm57qKcpq1lAOhhb1xDavU7hjsGol',
  access_token_secret:  'Gmeb7l8GYwbLy7xyB57hMn6cQjBLvBQLP3m6co2epRLu9',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("data query :",req.query);
  var params = {
    cursor:-1,
    screen_name:'Filelouch',
    skip_status:true,
    include_user_entities:false
  }

  /*client.get('favorites/list',params, function(error, tweets, response) {
    if(!error){

      console.log(tweets);  // The favorites.
      console.log(response);  // Raw response object.

      res.send({tweets:tweets,response:response,status:'ok'});
    }else{
      throw error;
    }
  });*/

  client_2.get('followers/list', { screen_name: 'Filelouch', cursor:-1, include_user_entities:false },  function (err, data, response) {
    res.send(data);
  })

  /*client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
      res.send(tweets);
    }
  });*/

  // var users = {
  //   user1: req.query.var1,
  //   user2: req.query.var2
  // }
  // res.send(users);
});

module.exports = router;
