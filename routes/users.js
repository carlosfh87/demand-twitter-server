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


var usersData = [];
var users = {user1: {},user2: {}, current:'user1'};

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("data query :",req.query);

  users = {
    user1: {screen_name:req.query.user1, cursor: -1},
    user2: {screen_name:req.query.user2, cursor: -1},
    current: 'user1',
    res: res
  }

  // client_2.get('followers/list', { screen_name: users[users.current].screen_name, cursor:users[users.current].cursor, include_user_entities:false, count:200 },  function (err, data, response) {
  //   res.send({error:err, data:data, response:response});
  // })

  console.log("users[users.current]",users[users.current])

  // getFollowers(users[users.current].screen_name, users[users.current].cursor, apiresponse)

  // users = {
  //   followers:[followers1.concat(followers2)],
  //   friends:[]
  // }
  res.send(users);

});

function apiresponse(err, data, reponse) {
  usersData = usersData.concat(data.users);
  users[users.current].cursor = data.next_cursor;

  console.log("cursor:", users[users.current].cursor )

  if(users[users.current].cursor !== 0){
    getFollowers(users[users.current].screen_name, users[users.current].cursor, apiresponse)
  }else{
    users.res.send(usersData);
  }
}

function getFollowers (screen_name, cursor, callback) {
  client_2.get('followers/list', { screen_name: screen_name, cursor:cursor, include_user_entities:false }, callback);
}

module.exports = router;
