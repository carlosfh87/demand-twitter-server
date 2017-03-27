var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
  // res.render('index', { title: 'Knomatic Twitter Service' });
});

module.exports = router;
