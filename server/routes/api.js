var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.json({ hello: 'api home' });
});

module.exports = router;
