var express = require('express');
var router = express.Router();
var Twit = require('twit');

var client_2 = new Twit({
  consumer_key:         'Mfr2N91xC1JJVWvcjthsM7j1X',
  consumer_secret:      'GMrRn4I691mVxiha6YGHp4Wn1RXfLmZIN53tRW8iqARg49uV1M',
  access_token:         '285409171-uXwaLMhbpNmtm57qKcpq1lAOhhb1xDavU7hjsGol',
  access_token_secret:  'Gmeb7l8GYwbLy7xyB57hMn6cQjBLvBQLP3m6co2epRLu9',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


var users1 = [];

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("data query :",req.query);

  var users = {
    user1: req.query.user1,
    user2: req.query.user2
  }

  client_2.get('followers/list', { screen_name: users.user1, cursor:-1, include_user_entities:false },  function (err, data, response) {
    res.send({error:err, data:data, response:response});
  })

  // users = {
  //   followers:[followers1.concat(followers2)],
  //   friends:[]
  // }
  // res.send(users);

});

function apiresponse(err, data, reponse) {
  if(!err){
    users1 = users1.concat(data.users);
    cursor = data.next_cursor;

    if(cursor != 0){

    }
  }
}

function getFollowers (screen_name, callback) {
  client_2.get('followers/list', { screen_name: screen_name, cursor:cursor, include_user_entities:false }, callback);
}

module.exports = router;
