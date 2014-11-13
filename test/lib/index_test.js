var should = require('should');
var supertest = require('supertest');
var app = require('../../app.js');
var instagram = require('../helpers/stub_instagram.js');

describe('Root controller', function() {
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

  describe('GET /', function() {

    it('should render index', function(done) {

      supertest(self.server).get('/').end(function(error, response) {
        response.statusCode.should.equal(200);
        response.text.should.include('Stream Instagram photos live');
        done();
      });
    });
  });

});

