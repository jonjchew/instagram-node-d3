var express = require('express');
var router = express.Router();
var world50m = require('../maps/world-50m.json')
var instagram = require('../lib/instagram')

/* GET home page. */
router.get('/', function(req, res) {
  var io = req.app.get('io')
  var self = this;
  var roomName;

  io.on('connection', function(socket){
    socket.on('subscribe', function(room) { 
        self.roomName = room;
        console.log('Joining room', room);
        socket.join(room); 
    })
    socket.on('disconnect', function(){
      console.log('User disconnected!');
      // Unsubscribe from hash tag subscription if nobody else is subscribed
      var room = io.nsps['/'].adapter.rooms[self.roomName];
      if (room != null) {
        if (Object.keys(room).length === 0) {
          var subscriptionId = req.sessionStore.subscriptionIds[self.roomName]
          instagram.unsubscribe(subscriptionId);
        }
      }
    });
  });
  res.render('index', { title: 'Express' });
});

router.get('/world-50m', function(req, res){
  res.json(world50m)
})

module.exports = router;
