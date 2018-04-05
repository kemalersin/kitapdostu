'use strict';

describe('Component: MatchingComponent', function() {
  // load the controller's module
  beforeEach(module('kitapdostuApp.matching'));

  var MatchingComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MatchingComponent = $componentController('matching', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
