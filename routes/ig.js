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

  instagram.findRecentByHashtag(hashTag, function(error, results) {
      if (error || results.length === 0) {
         res.status(400).send('The hashtag you entered cannot be viewed. Try a hashtag like #nofilter or #tbt.');
      }
      else {
        var locationPictures = instagram.filterLocationPictures(results);
        if (locationPictures.length === 0) {
          res.status(400).send("Couldn't find any pictures with locations for your hashtag. Try a more popular hashtag like #nofilter or #tbt.");
        }
        else {
          instagram.subscribeByHashtag(hashTag);
          res.send(locationPictures);
        }
      }
  });
});

module.exports = router;
