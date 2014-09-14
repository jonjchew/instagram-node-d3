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
  }
}


module.exports = instagram;
