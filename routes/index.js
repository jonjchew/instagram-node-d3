var express = require('express');
var router = express.Router();
var world50m = require('../maps/world-50m.json')

router.get('/', function(req, res) {
  res.render('index', { title: '#realtime' });
});

router.get('/world-50m', function(req, res){
  res.json(world50m)
})

module.exports = router;
