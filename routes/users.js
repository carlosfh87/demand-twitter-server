var express = require('express');
var router = express.Router();
var _ = require('underscore');
var Twit = require('twit');

var twitterApi = new Twit({
  consumer_key:         'Mfr2N91xC1JJVWvcjthsM7j1X',
  consumer_secret:      'GMrRn4I691mVxiha6YGHp4Wn1RXfLmZIN53tRW8iqARg49uV1M',
  access_token:         '285409171-uXwaLMhbpNmtm57qKcpq1lAOhhb1xDavU7hjsGol',
  access_token_secret:  'Gmeb7l8GYwbLy7xyB57hMn6cQjBLvBQLP3m6co2epRLu9',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
});


var usersData = [];
var users = {};

/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("data query :",req.query);

  usersData = [];
  users = {
    user1: {screen_name:req.query.user1, cursor: -1},
    user2: {screen_name:req.query.user2, cursor: -1},
    current: 'user1',
    res: res
  }

  // var usersstring = "48443,406743927,66912831,2542549416,2818515223,1325280360,585254092,84846175,276926175,110459784,48443,406743927,66912831,2542549416,2818515223,1325280360,585254092,84846175,276926175,110459784";

  // twitterApi.get('users/lookup', { user_id: usersstring },  function (err, user, response) {
  //   res.send(user);
  // });

  getFollowersIds(users.user1.screen_name, function(err, usersData, response){
    console.log("get all users")
    res.send(usersData);
  });

  // users = {
  //   followers:[followers1.concat(followers2)],
  //   friends:[]
  // }
  // res.json(users);

});

function apiresponse(err, data, response) {

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
    twitterApi.get('followers/list', { screen_name: screen_name, cursor:cursor, include_user_entities:false }, callback);
  }else{
    console.log("getFollowers send data:", usersData.length)
    users.res.send(usersData);
  }
}

function getFollowersIds (screen_name, callback) {
  var usersId = [];
  twitterApi.get('followers/ids', { screen_name: screen_name },  function (err, data, response) {
    if(!err){
      if( data && data.ids ){
        usersId = usersId.concat(data.ids);
        console.log("-------id user------",data.ids)
      }
      if( usersId === data.ids ){
        getFollowersIds(users.user2.screen_name, callback)
      }else{
        console.log("-----ids-----",usersId);
        var splitIds = chunckarray(usersId,Math.ceil(usersId.length/2));
        console.log("------splitIds-----",splitIds);
        var filterIs = _.intersection(splitIds[0], splitIds[1]);
        console.log("------filterIs-----", filterIs);
        usersId = _.uniq(usersId);
        getUsersByIds(usersId, callback);
        // getUsersById(usersId, callback);
      }
    }else{
      callback(err, data, response);
    }
  });
}

// function getUsersById(ids, callback){
//   var usersComplete = [];

//   ids.map(function(value,index){
//     twitterApi.get('users/show', { user_id: parseInt(value) },  function (err, user, response) {
//       if( user && !err ){
//         usersComplete.push(user);
//       }
//       console.log("user id", parseInt(value), usersComplete.length, ids.length-1, index );
//       if( ids.length === usersComplete.length ){
//         return callback(err, usersComplete, response);
//       }
//     });
//   });
// }

function getUsersByIds(ids, callback) {
  var usersComplete = [];
  ids = chunckarray(ids, 100);

  ids.map(function(value, index) {
    twitterApi.get('users/lookup', { user_id: value.toString() },  function (err, user, response) {
      if(!err) {
        usersComplete.push(user);
        console.log("getFollowersIds:",usersComplete);
        if(ids.length === usersComplete.length) {
          return callback(err, usersComplete, response);
        }
      } else {
        return callback(err, user, response);
      }
    });
  })
}

function getUsersLookup(ids) {
  // body...
}

function chunckarray(array,N){
  var i,
      j,
      temparray,
      chunk = N,
      arrayChunk = [];

  for (i=0,j=array.length; i<j; i+=chunk) {
      temparray = array.slice(i,i+chunk);
      arrayChunk.push(temparray);
  }
  return arrayChunk;
}

function getAllUsers(usersData) {
  console.log("getAllUsers:", usersData.length)
  users.res.send(usersData);
}

module.exports = router;
