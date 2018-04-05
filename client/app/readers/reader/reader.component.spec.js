'use strict';

describe('Component: ReaderComponent', function() {
  // load the controller's module
  beforeEach(module('kitapdostuApp.reader'));

  var ReaderComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ReaderComponent = $componentController('reader', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
