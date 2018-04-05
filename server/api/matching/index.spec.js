'use strict';

/* globals sinon, describe, expect, it */

var proxyquire = require('proxyquire').noPreserveCache();

var matchingCtrlStub = {
  index: 'matchingCtrl.index',
  show: 'matchingCtrl.show',
  create: 'matchingCtrl.create',
  upsert: 'matchingCtrl.upsert',
  patch: 'matchingCtrl.patch',
  destroy: 'matchingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var matchingIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './matching.controller': matchingCtrlStub
});

describe('Matching API Router:', function() {
  it('should return an express router instance', function() {
    expect(matchingIndex).to.equal(routerStub);
  });

  describe('GET /api/matchings', function() {
    it('should route to matching.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'matchingCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/matchings/:id', function() {
    it('should route to matching.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'matchingCtrl.show')
        ).to.have.been.calledOnce;
    });
  });

  describe('POST /api/matchings', function() {
    it('should route to matching.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'matchingCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/matchings/:id', function() {
    it('should route to matching.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'matchingCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/matchings/:id', function() {
    it('should route to matching.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'matchingCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/matchings/:id', function() {
    it('should route to matching.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'matchingCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
