var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Twit = require('twit');

var client_2 = new Twit({
  consumer_key:         'Mfr2N91xC1JJVWvcjthsM7j1X',
  consumer_secret:      'GMrRn4I691mVxiha6YGHp4Wn1RXfLmZIN53tRW8iqARg49uV1M',
  access_token:         '285409171-uXwaLMhbpNmtm57qKcpq1lAOhhb1xDavU7hjsGol',
  access_token_secret:  'Gmeb7l8GYwbLy7xyB57hMn6cQjBLvBQLP3m6co2epRLu9',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


var usersData = [];
var users = {};
var usersId = [];

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("data query :",req.query);

  usersData = [];
  usersId = [];
  users = {
    user1: {screen_name:req.query.user1, cursor: -1},
    user2: {screen_name:req.query.user2, cursor: -1},
    current: 'user1',
    res: res
  }

  console.log("users[users.current]",users[users.current].screen_name,users[users.current].cursor)

  getFollowersIds(users.user1.screen_name, getFollowersIds);

  // users = {
  //   followers:[followers1.concat(followers2)],
  //   friends:[]
  // }
  // res.json(users);

});

function apiresponse(err, data, reponse) {

  console.log("data:", data);

  if(data && data.users) {

    usersData = usersData.concat(data.users);
    users[users.current].cursor = data.next_cursor;

    console.log("apiresponse data.next_cursor:", data.next_cursor)
    console.log("apiresponse data:", data.users.length)
    console.log("cursor:", users[users.current].cursor )
  }

  if(data.next_cursor != 0 && data){
    getFollowers(users[users.current].screen_name, data.next_cursor, apiresponse)
  }else{
    console.log("apiresponse send data:", usersData.length)
    users.res.send(usersData);
  }
}

function getFollowers (screen_name, cursor, callback) {
  console.log("getFollowers:",screen_name,cursor)
  if( screen_name && cursor ){
    client_2.get('followers/list', { screen_name: screen_name, cursor:cursor, include_user_entities:false }, callback);
  }else{
    console.log("getFollowers send data:", usersData.length)
    users.res.send(usersData);
  }
}

function getFollowersIds (screen_name, callback) {//'tolga_tezel'
  client_2.get('followers/ids', { screen_name: screen_name },  function (err, data, response) {
    if( data && data.ids ){
      usersId = usersId.concat(data.ids);
      console.log("usersId:",usersId.length);
    }
    if( callback ){
      callback(users.user2.screen_name)
    }else{
      usersId = _.uniq(usersId);
      users.res.send(usersId);
    }
  })
}

function getUsersById(){
  for (var id in usersId){

  }
}

module.exports = router;
