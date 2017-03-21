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


/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log("data query :",req.query);

  var users = {
    user1: req.query.var1,
    user2: req.query.var2
  }

  var followers1 = getFollowers(users.user1);
  var followers2 = getFollowers(users.user2);

  // client_2.get('followers/list', { screen_name: 'Filelouch', cursor:-1, include_user_entities:false },  function (err, data, response) {
  //   res.send({error:err, data:data});
  // })

  users = {
    followers:[followers1.concat(followers2)],
    friends:[]
  }
  res.send(users);

});

function getFollowers (screen_name) {
  var cursor = -1,
      users = [];
  do {
    client_2.get('followers/list', { screen_name: 'Filelouch', cursor:cursor, include_user_entities:false },  function (err, data, response) {
      // res.send({error:err, data:data});
      if(!err){
        users = users.concat(data.users);
        cursor = cursor.concat(data.next_cursor);
      }
    });
  }
  while ( cursor != 0 )

  return data;
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
}

module.exports = router;
