var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  var io = req.app.get('io')
  // Create channel for user session
  // req.session['jon'] = 'chew'
  // console.log("Reading sessino: " + req.session['jon']);


  io.on('connection', function(socket){
    socket.join(req.session.id);
    // req.app.get('sessionStore').set(req.session.id, function(err, data){
    //   console.log("SESSION STORE SET", data);
    // });
  });  
  res.render('index', { title: 'Express' });
});

module.exports = router;
