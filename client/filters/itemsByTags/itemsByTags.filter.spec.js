'use strict';

describe('Filter: itemsByTags', function() {
  // load the filter's module
  beforeEach(module('kitapdostuApp.itemsByTags'));

  // initialize a new instance of the filter before each test
  var itemsByTags;
  beforeEach(inject(function($filter) {
    itemsByTags = $filter('itemsByTags');
  }));

  it('should return the input prefixed with "itemsByTags filter:"', function() {
    var text = 'angularjs';
    expect(itemsByTags(text)).to.equal('itemsByTags filter: ' + text);
  });
});
