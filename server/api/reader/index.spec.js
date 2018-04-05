'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var readerCtrlStub = {
  index: 'readerCtrl.index',
  show: 'readerCtrl.show',
  create: 'readerCtrl.create',
  upsert: 'readerCtrl.upsert',
  patch: 'readerCtrl.patch',
  destroy: 'readerCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var readerIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './reader.controller': readerCtrlStub
});

describe('Reader API Router:', function() {
  it('should return an express router instance', function() {
    expect(readerIndex).to.equal(routerStub);
  });

  describe('GET /api/readers', function() {
    it('should route to reader.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'readerCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/readers/:id', function() {
    it('should route to reader.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'readerCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/readers', function() {
    it('should route to reader.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'readerCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/readers/:id', function() {
    it('should route to reader.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'readerCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/readers/:id', function() {
    it('should route to reader.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'readerCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/readers/:id', function() {
    it('should route to reader.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'readerCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
