var express = require('express');
var router = express.Router();
var config = require('config');
var Instagram = require('instagram-node-lib');
var request = require("request");

router.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

router.post('/callback', function(req, res) {
    var io = req.app.get('io')
    var data = req.body;

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
      var hashTag = tag.object_id
      var url = 'https://api.instagram.com/v1/tags/' + hashTag + '/media/recent?client_id=' + config.instagram.client_id;
      console.log(url);
      request(url, function(error, response, body) {
        jsonBody = JSON.parse(body);
        // console.log('inside POST/callback - req.sessionStore['+hashTag+']: '+req.sessionStore[hashTag]);
        io.sockets.to(hashTag).emit('show', { show: jsonBody.data });


        // if(req.sessionStore[hashTag] != null){
        //   console.log('# of users: ' + req.sessionStore[hashTag].length);
        //   req.sessionStore[hashTag].forEach(function(sessionId){
        //     io.sockets.to(hashTag).emit('show', { show: jsonBody.data }):
        //     // req.sessionStore.users[sessionId].emit('show', { show: jsonBody.data });
        //     console.log("Broadcasted to " + sessionId);
        //   })
        // }
      });
    });
    res.end();
});

router.post('/subscribe', function(req, res) {
    var io = req.app.get('io')
    var hashTag = req.body.hash_tag;

    // io.on('connection', function(socket){
    //   console.log('hit');
    //   socket.join(hashTag);
    // });

    // if (!req.sessionStore[hashTag]) {
    //   req.sessionStore[hashTag] = [req.session.id];
    // }
    // else {
    //   req.sessionStore[hashTag].push(req.session.id);
    // }
    // console.log("req.sessionStore[sf] - " + req.sessionStore.sf);
    // console.log("req.sessionStore[hk] - " + req.sessionStore.hk);
    // console.log("HEY")

    // console.log("req.sessionStore["+hashTag+"] - " + req.sessionStore[hashTag]);

    Instagram.tags.recent({
        name: hashTag,
        complete: function(data) {
          // console.log("Room subscribed: " + req.session.id);
          io.sockets.to(hashTag).emit('firstShow', { firstShow: data });
        }
    });

    Instagram.subscriptions.subscribe({
      object: 'tag',
      object_id: hashTag,
      aspect: 'media',
      callback_url: config.root_url + '/ig/callback',
      type: 'subscription',
      id: '#'
    });

    res.writeHead(200);
    return res.end();

});

module.exports = router;
