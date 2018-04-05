'use strict';

describe('Directive: anchor', function() {
  // load the directive's module
  beforeEach(module('kitapdostuApp.anchor'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<a></a>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the a directive');
  }));
});
