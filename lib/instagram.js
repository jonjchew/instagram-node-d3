var Instagram = require('instagram-node-lib');
var config = require('config')
var request = require("request");

var instagram = {
  initialize: function() {
    Instagram.set('client_id', config.instagram.client_id);
    Instagram.set('client_secret', config.instagram.client_secret);
    Instagram.set('callback_url', config.root_url + '/ig/callback');
    Instagram.set('redirect_uri', config.root_url);
    Instagram.set('maxSockets', 10);

    Instagram.subscriptions.unsubscribe_all({});
  },

  subscribeByHashtag: function(hashTag, callback) {
    // Can't use the wrapper because it doesn't return the response object we need
    var url = 'https://api.instagram.com/v1/subscriptions/';
    var params = {
      client_id: config.instagram.client_id,
      client_secret: config.instagram.client_secret,
      callback_url: config.root_url + '/ig/callback',
      object: 'tag',
      aspect: 'media',
      object_id: hashTag
    }
    request.post({url: url, form: params}, function(error, response, body) {
      jsonBody = JSON.parse(body);
      if (jsonBody.meta.code === 200) {
        return callback(jsonBody.data.id);
      }
      else {
        return callback(null);
      }
    });
  },

  findRecentByHashtag: function(hashTag, callback) {
    Instagram.tags.recent({
      name: hashTag,
      complete: function(data) {
        console.log("Recent pictures for " + hashTag + " sent");
        return callback(data);
      }
    });
  },

  parseUpdateObjects: function(updateObjects, callback) {
    if ( Object.prototype.toString.call(updateObjects) === '[object Array]') {

      updateObjects.forEach(function(tag) {
        if (tag.object_id != null) {

          var hashTag = tag.object_id;
          var url = 'https://api.instagram.com/v1/tags/' + hashTag + '/media/recent?client_id=' + config.instagram.client_id;

          console.log("Received update object for " + hashTag + " hash tag");

          return callback(url, hashTag);
        }
      });

    }
  },

  filterLocationPictures: function(pictures) {
    var locationPictures = []
    pictures.forEach(function(picture) {
      if (picture.location != null){
        locationPictures.push(picture);
      }
    });
    return locationPictures;
  },

  unsubscribe: function(subscriptionId) {
    Instagram.subscriptions.unsubscribe({id: subscriptionId});
    console.log(subscriptionId + ' subscription unsubscribed');
  }
}


module.exports = instagram;
