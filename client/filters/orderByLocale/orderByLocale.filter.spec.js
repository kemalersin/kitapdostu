'use strict';

describe('Filter: orderByLocale', function() {
  // load the filter's module
  beforeEach(module('kitapdostuApp.orderByLocale'));

  // initialize a new instance of the filter before each test
  var orderByLocale;
  beforeEach(inject(function($filter) {
    orderByLocale = $filter('orderByLocale');
  }));

  it('should return the input prefixed with "orderByLocale filter:"', function() {
    var text = 'angularjs';
    expect(orderByLocale(text)).to.equal('orderByLocale filter: ' + text);
  });
});
