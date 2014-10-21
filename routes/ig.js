var express = require('express');
var router = express.Router();
var config = require('config');
var Instagram = require('instagram-node-lib');
var request = require("request");
var instagram = require('../lib/instagram')

router.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

router.post('/callback', function(req, res) {
    var io = req.app.get('io');
    var data = req.body;

    instagram.parseUpdateObjects(data, function(url, hashTag) {
      request(url, function(error, response, body) {
        jsonBody = JSON.parse(body);

        if (jsonBody.meta != null && jsonBody.meta.code === 200) {
          var locationPictures = instagram.filterLocationPictures(jsonBody.data);
          io.sockets.to(hashTag).emit('msg', { posts: locationPictures });
        }
      });
    });
    res.end();
});

router.post('/subscribe', function(req, res) {
    var io = req.app.get('io');
    var hashTag = req.body.hash_tag;

    instagram.findRecentByHashtag(hashTag, function(data) {
      io.sockets.to(hashTag).emit('msg', { posts: data });
    });

    instagram.subscribeByHashtag(hashTag, function(subscriptionId) {
      if (req.sessionStore.subscriptions === undefined) {
        req.sessionStore.subscriptionIds = {};
      }
      req.sessionStore.subscriptionIds[hashTag] = subscriptionId;
    });

    res.writeHead(200);
    return res.end();
});

module.exports = router;
