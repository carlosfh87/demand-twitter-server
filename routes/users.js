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

  var users = [req.query.user1.trim(),req.query.user2.trim()];

  var ids = [];
  users.map(function(value,index) {
    twitterApi.get('followers/ids', { screen_name: value },  function (err, user, response) {

      if(!err){

        ids.push(user.ids)
        console.log("----ids-----",value,ids);

        if(ids.length == users.length){

          var filterIds = _.intersection(ids[0], ids[1]);

          console.log("----filterIds-----",filterIds);
          getUsersByIds(filterIds, function(err, usersComplete, response) {
            if(err) return res.send({error:err});
            res.send(usersComplete);
          });
        }
      } else {
        res.send({error:err});
      }
    });
  })

  // var usersstring = "48443,406743927,66912831,2542549416,2818515223,1325280360,585254092,84846175,276926175,110459784,48443,406743927,66912831,2542549416,2818515223,1325280360,585254092,84846175,276926175,110459784";


  // getFollowersIds(users.user1.screen_name, function(err, usersData, response){
  //   console.log("get all users")
  //   res.send(usersData);
  // });

  // users = {
  //   followers:[followers1.concat(followers2)],
  //   friends:[]
  // }
  // res.json(users);

});

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
