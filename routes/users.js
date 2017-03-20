var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("data query :",req.query);
  var users = {
    user1: req.query.var1,
    user2: req.query.var2
  }
  res.send(users);
});

module.exports = router;
