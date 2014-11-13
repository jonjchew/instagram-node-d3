var should = require('should');
var instagram = require('../../lib/instagram')
var updateObject = require('../fixtures/ig_update_object.json');
var queryResponse = require('../fixtures/ig_query_response.json');

describe('Instagram module', function() {

  describe('#parseUpdateObjects', function() {

    it('should return hashtags as strings', function(done) {
      instagram.parseUpdateObjects(updateObject, function(hashTag) {
        hashTag.should.equal(updateObject[0].object_id)
        done();
      });
    });
  });

  describe('#filterLocationPictures', function() {

    it('should only return pictures with location data', function(done) {
      queryResponse.length.should.equal(20);
      var filteredResults = instagram.filterLocationPictures(queryResponse)
      filteredResults.length.should.equal(4);
      done();
    });
  });

});

