'use strict';

export default angular.module('kitapdostuApp.autofocus', [])
  .directive('autofocus', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        $timeout(() => {
          element[0].focus();
        });
      }
    };
  })
  .name;
