'use strict';

describe('Component: BooksComponent', function() {
  // load the controller's module
  beforeEach(module('kitapdostuApp.books'));

  var BooksComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    BooksComponent = $componentController('books', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
