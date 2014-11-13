var express = require('express');
var router = express.Router();
var config = require('config');
var instagram = require('../lib/instagram')
var socket = require('../lib/socket_helper')
var RateLimiter = require('limiter').RateLimiter;
var limiter = new RateLimiter(1, 2000, true);

router.get('/callback', function(req, res){
  instagram.handshake(req, res);
  res.end()
});

router.post('/callback', function(req, res) {
  var io = req.app.get('io');

  limiter.removeTokens(1, function(err, remainingRequests) {
    if (remainingRequests < 0) {
      res.status(429).send("Too many requests");
    }
    else {
      instagram.parseUpdateObjects(req.body, function(hashTag) {
        instagram.findRecentByHashtag(hashTag, function(error, results) {
          if(error) {
            console.log(error);
          }
          else if(results.length) {
            var locationPictures = instagram.filterLocationPictures(results);
            io.sockets.to(hashTag).emit('msg', { posts: locationPictures });
          }
        });
      });
    }
  });
  res.end();
});

router.post('/subscribe', function(req, res) {
  var hashTag = req.body.hash_tag;

  instagram.findRecentByHashtag(hashTag, function(error, results) {
      if (error || results.length === 0) {
         res.status(400).send('The hashtag you entered cannot be viewed. Try a hashtag like #nofilter, #love, or #selfie.');
      }
      else {
        var locationPictures = instagram.filterLocationPictures(results);
        if (locationPictures.length === 0) {
          res.status(400).send("Couldn't find any pictures with locations for your hashtag. Try a more popular hashtag like #nofilter, #love, or #selfie.");
        }
        else {
          instagram.subscribeByHashtag(hashTag);
          res.send(locationPictures);
        }
      }
  });
});

router.get('/health_check', function(req, res) {
  var io = req.app.get('io');
  var connected_clients = socket.findClients(io);
  instagram.getStatus(function (error, result) {
    if(error) {
      error.connected_clients = connected_clients;
      res.status(400).send(error);
    }
    else {
      result.connected_clients = connected_clients;
      res.send(result);
    }
  })
})

module.exports = router;
