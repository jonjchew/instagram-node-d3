var request = require('request');
var sinon = require('sinon');
var Instagram = require('instagram-node-lib');

module.exports.stubInitialize = function() {
  sinon.stub(instagram, 'initialize');
}

module.exports.stubHandshake = function() {
  sinon.stub(instagram, 'handshake');
}

module.exports.stubFindRecent = function(results) {
  sinon.stub(instagram, 'findRecentByHashtag')
    .yields(null, results);
}

module.exports.stubFilterLocationPics = function(results) {
  sinon.stub(instagram, 'filterLocationPictures').returns(results);
}

module.exports.stubSubscribe = function() {
  sinon.stub(instagram, 'subscribeByHashtag');
}

module.exports.restore = function(method) {
  instagram[method].restore();
}

