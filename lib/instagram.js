var Instagram = require('instagram-node-lib');
var config = require('config')

var instagram = {
  initialize: function() {
    Instagram.set('client_id', config.instagram.client_id);
    Instagram.set('client_secret', config.instagram.client_secret);
    Instagram.set('callback_url', config.root_url + '/callback');
    Instagram.set('redirect_uri', config.root_url);
    Instagram.set('maxSockets', 10);

    Instagram.subscriptions.unsubscribe_all({});
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

  filterLocationPictures: function(pictures) {
    var locationPictures = []
    pictures.forEach(function(picture) {
      if (picture.location != null){
        locationPictures.push(picture);
      }
    });
    return locationPictures;
  }
}


module.exports = instagram;
