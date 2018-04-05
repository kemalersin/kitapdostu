'use strict';

export default angular.module('kitapdostuApp.keepScrollPos', [])
  .directive('keepScrollPos', function($anchorScroll, $interval, $location, $rootScope, $state, $window) {
    let stop;
    let scrollPosCache = {};

    return function(scope, element, attrs) {
      scope.startInterval = () => {
        if (angular.isDefined(stop)) {
          return;
        }

        stop = $interval(() => {
          let prevScrollPos = scrollPosCache[
            $state.current.name + JSON.stringify($state.params)
          ] || [0, 0];
        
          if (
              $window.pageXOffset === prevScrollPos[0] &&
              $window.pageYOffset === prevScrollPos[1]) {
            return scope.stopInterval();
          }
          
          $window.scrollTo(prevScrollPos[0], prevScrollPos[1]);
        }, 50, 200);
      }

      scope.stopInterval = () => {
        if (angular.isDefined(stop)) {
          $interval.cancel(stop);
          stop = undefined;
        }
      };

      scope.$on('$destroy', () => {
        scope.stopInterval();
      });

      scope.$on('$stateChangeStart', () => {
        if ($state.current.name) {
          scrollPosCache[
            $state.current.name + JSON.stringify($state.params)
          ] = [$window.pageXOffset, $window.pageYOffset];
        }
      });

      scope.$on('$stateChangeSuccess', function() {
        if ($location.hash() || $rootScope.anchorClicked) {
          $rootScope.anchorClicked = false; 
          return $anchorScroll();
        }

        scope.startInterval();
      });
    }
  })
  .name;
