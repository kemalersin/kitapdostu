'use strict';

describe('Component: ReadersComponent', function() {
  // load the controller's module
  beforeEach(module('kitapdostuApp.readers'));

  var ReadersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ReadersComponent = $componentController('readers', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
