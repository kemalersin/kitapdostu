'use strict';

/* globals describe, expect, it, beforeEach, afterEach */

var app = require('../..');
import request from 'supertest';

var newReader;

describe('Reader API:', function() {
  describe('GET /api/readers', function() {
    var readers;

    beforeEach(function(done) {
      request(app)
        .get('/api/readers')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          readers = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(readers).to.be.instanceOf(Array);
    });
  });

  describe('POST /api/readers', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/readers')
        .send({
          name: 'New Reader',
          info: 'This is the brand new reader!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          newReader = res.body;
          done();
        });
    });

    it('should respond with the newly created reader', function() {
      expect(newReader.name).to.equal('New Reader');
      expect(newReader.info).to.equal('This is the brand new reader!!!');
    });
  });

  describe('GET /api/readers/:id', function() {
    var reader;

    beforeEach(function(done) {
      request(app)
        .get(`/api/readers/${newReader._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          reader = res.body;
          done();
        });
    });

    afterEach(function() {
      reader = {};
    });

    it('should respond with the requested reader', function() {
      expect(reader.name).to.equal('New Reader');
      expect(reader.info).to.equal('This is the brand new reader!!!');
    });
  });

  describe('PUT /api/readers/:id', function() {
    var updatedReader;

    beforeEach(function(done) {
      request(app)
        .put(`/api/readers/${newReader._id}`)
        .send({
          name: 'Updated Reader',
          info: 'This is the updated reader!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          updatedReader = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedReader = {};
    });

    it('should respond with the updated reader', function() {
      expect(updatedReader.name).to.equal('Updated Reader');
      expect(updatedReader.info).to.equal('This is the updated reader!!!');
    });

    it('should respond with the updated reader on a subsequent GET', function(done) {
      request(app)
        .get(`/api/readers/${newReader._id}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          let reader = res.body;

          expect(reader.name).to.equal('Updated Reader');
          expect(reader.info).to.equal('This is the updated reader!!!');

          done();
        });
    });
  });

  describe('PATCH /api/readers/:id', function() {
    var patchedReader;

    beforeEach(function(done) {
      request(app)
        .patch(`/api/readers/${newReader._id}`)
        .send([
          { op: 'replace', path: '/name', value: 'Patched Reader' },
          { op: 'replace', path: '/info', value: 'This is the patched reader!!!' }
        ])
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if(err) {
            return done(err);
          }
          patchedReader = res.body;
          done();
        });
    });

    afterEach(function() {
      patchedReader = {};
    });

    it('should respond with the patched reader', function() {
      expect(patchedReader.name).to.equal('Patched Reader');
      expect(patchedReader.info).to.equal('This is the patched reader!!!');
    });
  });

  describe('DELETE /api/readers/:id', function() {
    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete(`/api/readers/${newReader._id}`)
        .expect(204)
        .end(err => {
          if(err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when reader does not exist', function(done) {
      request(app)
        .delete(`/api/readers/${newReader._id}`)
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
