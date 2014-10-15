var express = require('express');
var router = express.Router();
var world50m = require('../maps/world-50m.json')

/* GET home page. */
router.get('/', function(req, res) {
  var io = req.app.get('io')

  io.on('connection', function(socket){
    socket.on('subscribe', function(room) { 
        console.log('Joining room', room);
        socket.join(room); 
    })
    socket.on('disconnect', function(){
      console.log('User disconnected!');
    });
  });
  res.render('index', { title: 'Express' });
});

router.get('/world-50m', function(req, res){
  res.json(world50m)
})

module.exports = router;
