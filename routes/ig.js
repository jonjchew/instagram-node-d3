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
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=' + config.instagram.client_id;
      console.log(url);
      request(url, function(error, response, body) {
        jsonBody = JSON.parse(body);
        io.sockets.emit('show', { show: jsonBody.data });
      });
    });
    res.end();
});

router.post('/subscribe', function(req, res) {
    var io = req.app.get('io')

    Instagram.tags.recent({
        name: req.body.hash_tag,
        complete: function(data) {
          io.sockets.emit('firstShow', { firstShow: data });
        }
    });

    Instagram.subscriptions.subscribe({
      object: 'tag',
      object_id: req.body.hash_tag,
      aspect: 'media',
      callback_url: config.root_url + '/ig/callback',
      type: 'subscription',
      id: '#'
    });

    res.writeHead(200);
    return res.end();

});

module.exports = router;
