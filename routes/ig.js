var express = require('express');
var router = express.Router();
var config = require('config');
var Instagram = require('instagram-node-lib');


router.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

router.post('/callback', function(req, res) {
    var data = req.body;

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id=' + config.instagram.client_id;
      console.log(url);
      // sendMessage(url);

    });
    res.end();
});

module.exports = router;
