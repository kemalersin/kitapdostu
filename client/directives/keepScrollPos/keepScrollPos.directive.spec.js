'use strict';

describe('Directive: keepScrollPos', function() {
  // load the directive's module
  beforeEach(module('kitapdostuApp.keepScrollPos'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<keep-scroll-pos></keep-scroll-pos>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the keepScrollPos directive');
  }));
});
