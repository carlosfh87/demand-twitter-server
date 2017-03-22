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

/* GET users Followers. */
router.get('/', function(req, res, next) {

  var users = [req.query.user1.trim(),req.query.user2.trim()];

  var responseData = {
    data:{},
    search:[
      {type:'followers/ids', key:'followers'},
      {type:'friends/ids', key:'friends'}
    ]
  }

  responseData.search.map(function(searchBy, searchIndex) {
    // body...
    var ids = [];
    users.map(function(value,index) {
      // twitterApi.get('followers/ids', { screen_name: value },  function (err, user, response) {
      twitterApi.get(searchBy.type, { screen_name: value },  function (err, user, response) {

        if(!err){
          ids.push(user.ids);

          if(ids.length == users.length){
            var filterIds = _.intersection(ids[0], ids[1]);

            if(filterIds.length){
              getUsersByIds(filterIds, function(err, usersComplete, response) {
                if(err) {
                  res.send({error:err})
                } else {
                  // res.send(usersComplete);
                  responseData.data[searchBy.key] = usersComplete;

                  if( responseData.data.hasOwnProperty('followers') && responseData.data.hasOwnProperty('friends') ){
                    res.send(responseData.data);
                  }
                }
              });
            } else {
              // res.send(filterIds)
              responseData.data[searchBy.key] = filterIds;
              if( responseData.data.hasOwnProperty('followers') && responseData.data.hasOwnProperty('friends') ){
                res.send(responseData.data);
              }
            }
          }
        } else {
          res.send({error:err});
          return false;
        }
      });
    })
  })


});

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

module.exports = router;
