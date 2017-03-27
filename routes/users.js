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

/* GET users Followers/Friends. */
router.get('/', function(req, res, next) {

  if(!req.query.user1 || !req.query.user2){
    res.send({error:{"message":"Missing users"}});
    return false;
  }

  // Get users screen_name from the GET request
  var users = [req.query.user1.trim(),req.query.user2.trim()];

  // Variable that storage all the followers and friends of both users
  var responseData = {
    data:{},
    search:[
      {type:'followers/ids', key:'followers'},
      {type:'friends/ids', key:'friends'}
    ]
  }

  // Get the followers and and friends users dinamycally mapping the responseData.search array
  responseData.search.map(function(searchBy, searchIndex) {

    var ids = [];
    users.map(function(value,index) {
      // Get id´s from both usernames
      twitterApi.get(searchBy.type, { screen_name: value },  function (err, user, response) {

        // Check if there no error from getting ids from 'followers/ids' and 'friends/ids' calls
        if(!err){
          ids.push(user.ids);

          // Verify if 'followers/ids' or 'friends/ids' have been call for both users
          if(ids.length == users.length){
            // get the common users ids among the two users
            var filterIds = _.intersection(ids[0], ids[1]);

            // Get users if filtersIds is not empty
            if(filterIds.length){
              getUsersByIds(filterIds, function(err, usersComplete, response) {
                if(err) {
                  res.send({error:err})
                } else {
                  // Create a key with the results dependig of the api call ('followers/friends')
                  responseData.data[searchBy.key] = usersComplete[0];

                  // Validate if followers and friends data have been getted for boths users
                  if( responseData.data.hasOwnProperty('followers') && responseData.data.hasOwnProperty('friends') ){
                    // Send response
                    res.set({
                      'Access-Control-Allow-Origin': '*',
                      'Access-Control-Allow-Methods': "GET, POST, PUT",
                      'Access-Control-Allow-Headers': 'X-Requested-With'
                    })
                    res.send(responseData.data);
                  }
                }
              });
            } else {
              // Create a key with the results dependig of the api call ('followers/friends')
              responseData.data[searchBy.key] = filterIds;

              // Validate if followers and friends data have been getted for boths users
              if( responseData.data.hasOwnProperty('followers') && responseData.data.hasOwnProperty('friends') ){
                res.set({
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Methods': "GET, POST, PUT",
                  'Access-Control-Allow-Headers': 'X-Requested-With'
                })
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

/**
 * Get the common followers/folowing between the twitter users.
 * @param
 * - ids         Array with the common followers/folowing id's between the twitter users
 * - callback   Callbak function with the response
 * @return callback  Rerturns a callback function with response params
 */
function getUsersByIds(ids, callback) {
  var usersComplete = [];
  ids = chunckarray(ids, 100);

  ids.map(function(value, index) {
    twitterApi.get('users/lookup', { user_id: value.toString() },  function (err, user, response) {
      if(!err) {
        usersComplete.push(user);
        if(ids.length === usersComplete.length) {
          return callback(err, usersComplete, response);
        }
      } else {
        return callback(err, user, response);
      }
    });
  })
}

/**
 * This function slice an array creating and array of M arrays with N items each.
 * @param
 * - array        the common followers/folowing id's bwtween thw given users
 * - N            Total of items per array
 * @return array  Rerturns and array of arrays
 */
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
