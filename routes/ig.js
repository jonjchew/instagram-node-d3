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

    data.forEach(function(tag) {
      var hashTag = tag.object_id
      var url = 'https://api.instagram.com/v1/tags/' + hashTag + '/media/recent?client_id=' + config.instagram.client_id;
      console.log("Received update object for " + hashTag + " hash tag");
      request(url, function(error, response, body) {
        jsonBody = JSON.parse(body);
        io.sockets.to(hashTag).emit('show', { show: jsonBody.data });
      });
    });
    res.end();
});

router.post('/subscribe', function(req, res) {
    var io = req.app.get('io')
    var hashTag = req.body.hash_tag;

    Instagram.tags.recent({
        name: hashTag,
        complete: function(data) {
          console.log("Recents pictures for " + hashTag + " sent");
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
    console.log("Subscribed to " + hashTag + "hash tag");

    res.writeHead(200);
    return res.end();

});

module.exports = router;
