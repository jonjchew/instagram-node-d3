var should = require('should');
var supertest = require('supertest');
var app = require('../../app.js');
var instagram = require('../helpers/stub_instagram.js');
var updateObject = require('../fixtures/ig_update_object.json');
var queryResponse = require('../fixtures/ig_query_response.json');

describe('/ig', function() {
  var self = this;

  before(function(done) {
    self.server = app.get('server');
    instagram.stubInitialize();
    done();
  });

  after(function(done) {
    instagram.restore('initialize');
    done();
  });

  describe('GET /ig/callback', function() {

    before(function(done) {
      instagram.stubHandshake();
      done()
    });

    after(function(done) {
      instagram.restore('handshake');
      done();
    });

    it('should return handshake with Instagram', function(done) {
      var params = '?hub.challenge=5asdfb&hub.mode=subscribe'

      supertest(self.server).get('/ig/callback' + params).end(function(error, response) {
        response.statusCode.should.equal(200);
        done();
      });
    });
  });

  describe('POST /ig/callback', function() {

    before(function(done) {
      instagram.stubFindRecent(queryResponse);
      done()
    });

    after(function(done) {
      instagram.restore('findRecentByHashtag');
      done();
    });

    it('should return a 200', function(done) {
      supertest(self.server).post('/ig/callback')
        .send(updateObject)
        .end(function(error, response) {
          response.statusCode.should.equal(200);
          done();
      });
    });   

    it('should return a 429 error if too many update objects received at once', function(done) {
      supertest(self.server).post('/ig/callback')
        .send(updateObject)
        .end(function(error, response) {
          response.statusCode.should.equal(429);
          done();
        });
    }); 
  });

  describe('POST /ig/subscribe', function() {

    beforeEach(function(done) {
      instagram.stubSubscribe();
      done();
    });

    afterEach(function(done) {
      instagram.restore('findRecentByHashtag');
      instagram.restore('filterLocationPictures');
      instagram.restore('subscribeByHashtag');
      done();
    });

    it('should return Instagram objects on successful query', function(done) {
      instagram.stubFindRecent(queryResponse);
      instagram.stubFilterLocationPics(queryResponse);
      supertest(self.server).post('/ig/subscribe')
        .send({hash_tag: 'nofilter'})
        .end(function(error, response) {
          response.statusCode.should.equal(200);
          response.body.should.eql(queryResponse);
          done();
        });
    });

    it('should return error if no objects found', function(done) {
      instagram.stubFindRecent([]);
      instagram.stubFilterLocationPics();
      supertest(self.server).post('/ig/subscribe')
        .send({hash_tag: 'nofilter'})
        .end(function(error, response) {
          response.statusCode.should.equal(400);
          done();
        })
    });

    it('should return error if no location objects found', function(done) {
      instagram.stubFilterLocationPics([]);
      instagram.stubFindRecent(queryResponse);
      supertest(self.server).post('/ig/subscribe')
        .send({hash_tag: 'nofilter'})
        .end(function(error, response) {
          response.statusCode.should.equal(400);
          done();
        })
    });
  })

});

