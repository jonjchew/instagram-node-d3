var express = require('express');
var router = express.Router();
var config = require('config');
var request = require("request");
var instagram = require('../lib/instagram')

router.get('/callback', function(req, res){
  var handshake =  instagram.handshake(req, res);
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

  instagram.subscribeByHashtag(hashTag);

  res.writeHead(200);
  return res.end();

});

module.exports = router;
