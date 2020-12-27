var express = require('express');
var router = express.Router();
var debug = require('debug')('server:server');

const Switch = require('../robot').Switch;

const light = new Switch();

router.get('/', function(req, res, next) {
  res.json({ hello: 'api home' });
});

router.post('/switch/0', async (req, res, next) => {
  if (req.body.state) {
    debug('Turning light on');
    light.on();
    debug('After Turning light on');
  }
  else {
    debug('Turning light off');
    light.off();
    debug('After Turning light off');
  }
  res.json({ state: !!light.get() });
});

router.get('/switch/0', async (req, res, next) => {
  res.json({ state: !!light.get() });
});

module.exports = router;
