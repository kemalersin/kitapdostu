'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newMatching;

describe('Matching API:', function() {
  describe('GET /api/matchings', function() {
    var matchings;

    beforeEach(function(done) {
      request(app)
        .get('/api/matchings')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          matchings = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(matchings).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/matchings', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/matchings')
        .send({
          name: 'New Matching',
          info: 'This is the brand new matching!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newMatching = res.body;
          done();
        });
    });

    it('should respond with the newly created matching', function() {
      expect(newMatching.name).to.equal('New Matching');
      expect(newMatching.info).to.equal('This is the brand new matching!!!');
    });
  });

  describe('GET /api/matchings/:id', function() {
    var matching;

    beforeEach(function(done) {
      request(app)
        .get(`/api/matchings/${newMatching._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          matching = res.body;
          done();
        });
    });

    afterEach(function() {
      matching = {};
    });

    it('should respond with the requested matching', function() {
      expect(matching.name).to.equal('New Matching');
      expect(matching.info).to.equal('This is the brand new matching!!!');
    });
  });

  describe('PUT /api/matchings/:id', function() {
    var updatedMatching;

    beforeEach(function(done) {
      request(app)
        .put(`/api/matchings/${newMatching._id}`)
        .send({
          name: 'Updated Matching',
          info: 'This is the updated matching!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedMatching = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMatching = {};
    });

    it('should respond with the updated matching', function() {
      expect(updatedMatching.name).to.equal('Updated Matching');
      expect(updatedMatching.info).to.equal('This is the updated matching!!!');
    });

    it('should respond with the updated matching on a subsequent GET', function(done) {
      request(app)
        .get(`/api/matchings/${newMatching._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let matching = res.body;

          expect(matching.name).to.equal('Updated Matching');
          expect(matching.info).to.equal('This is the updated matching!!!');

          done();
        });
    });
  });

  describe('PATCH /api/matchings/:id', function() {
    var patchedMatching;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/matchings/${newMatching._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Matching' },
          { op: 'replace', path: '/info', value: 'This is the patched matching!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedMatching = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedMatching = {};
    });

    it('should respond with the patched matching', function() {
      expect(patchedMatching.name).to.equal('Patched Matching');
      expect(patchedMatching.info).to.equal('This is the patched matching!!!');
    });
  });

  describe('DELETE /api/matchings/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/matchings/${newMatching._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when matching does not exist', function(done) {
      request(app)
        .delete(`/api/matchings/${newMatching._id}`)
        .expect(404)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });
  });
});
