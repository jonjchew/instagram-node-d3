var Instagram = require('instagram-node-lib');
var config = require('config-heroku')
var request = require('request');
var qs = require('querystring');

var instagram = {
  initialize: function() {
    Instagram.set('client_id', config.instagram.client_id);
    Instagram.set('client_secret', config.instagram.client_secret);
    Instagram.set('callback_url', config.root_url + '/ig/callback');
    Instagram.set('redirect_uri', config.root_url);
    Instagram.set('maxSockets', 10);

    Instagram.subscriptions.unsubscribe_all({});
  },

  handshake: function(req, res) {
    Instagram.subscriptions.handshake(req, res);
  },

  subscribeByHashtag: function(hashTag) {
    Instagram.subscriptions.subscribe({
      object: 'tag',
      object_id: hashTag,
      aspect: 'media',
      callback_url: config.root_url + '/ig/callback',
      type: 'subscription',
      id: '#'
    });
    console.log("Subscribed to hash tag: " + hashTag);
  },

  findRecentByHashtag: function(hashTag, callback) {
    console.log("Recent pictures for " + hashTag + " queried");
    Instagram.tags.recent({
      name: hashTag,
      complete: function(data) {
        console.log("Recent pictures for " + hashTag + " received");
        return callback(null, data);
      },
      error: function(errorMessage, errorObject, caller){
        callback(errorObject, null);
      }
    });
  },

  parseUpdateObjects: function(updateObjects, callback) {
    if ( Object.prototype.toString.call(updateObjects) === '[object Array]') {

      updateObjects.forEach(function(tag) {
        if (tag.object_id != null) {

          var hashTag = tag.object_id;
          console.log("Received update object for " + hashTag + " hash tag");

          return callback(hashTag);
        }
      });
    }
  },

  filterLocationPictures: function(pictures) {
    var locationPictures = []
    pictures.forEach(function(picture) {
      if (picture.location != null && picture.location.longitude && picture.location.latitude){
        locationPictures.push(picture);
      }
    });
    return locationPictures;
  },

  unsubscribeByHashTag: function(hashTag) {
    var url = 'https://api.instagram.com/v1/subscriptions?';

    var params = {
      client_id: config.instagram.client_id,
      client_secret: config.instagram.client_secret,
    }

    url += qs.stringify(params)

    request(url, function(error, response, body) {
      jsonBody = JSON.parse(body);
      if (jsonBody.meta.code === 200) {
        var subscriptions = jsonBody.data;
        subscriptions.forEach(function(subscription){
          if (subscription.object_id === hashTag) {
            Instagram.subscriptions.unsubscribe({id: subscription.id});
            console.log("Unsubscribed to " + hashTag);
          }
        })
      }
    });
  },

  getStatus: function(callback) {
    var url = 'https://api.instagram.com/v1/subscriptions?client_secret=' + config.instagram.client_secret + '&client_id=' + config.instagram.client_id;
    request(url, function(error, response, body) {
      if(error) {
        callback(error, null);
      }
      else {
        var parsedResponse = {
          status_code: response.statusCode,
          rate_limit: response.headers['x-ratelimit-limit'],
          queries_remaing: response.headers['x-ratelimit-remaining'],
        }
        var jsonBody = JSON.parse(body)
        if (jsonBody.data) {
          parsedResponse.current_subscriptions = jsonBody.data
        }
        callback(null, parsedResponse);
      }
    });
  }
}


module.exports = instagram;
