var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var io = req.app.get('io')
  // Create channel for user session
  // req.session['jon'] = 'chew'
  // console.log("Reading sessino: " + req.session['jon']);


  io.on('connection', function(socket){
    socket.on('subscribe', function(room) { 
        console.log('joining room', room);
        socket.join(room); 
    })
  });

  //   socket.join(req.session.id);
  //   console.log("JOINED: " + req.session.id)
  //   if (req.sessionStore.users === undefined){
  //     req.sessionStore.users = {};
  //   }
  //   req.sessionStore.users[req.session.id] = socket;
  // });  
  res.render('index', { title: 'Express' });
});

module.exports = router;
