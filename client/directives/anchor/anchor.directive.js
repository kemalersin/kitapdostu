'use strict';

export default angular.module('kitapdostuApp.anchor', [])
  .directive('a', function($rootScope) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs) {
        element.on('click', (e) => {
          $rootScope.anchorClicked = true;
        });
      }
    };
  })
  .name;
