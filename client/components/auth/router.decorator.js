'use strict';

export function routerDecorator($rootScope, $state, Auth) {
  'ngInject';
  // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role

  $rootScope.$on('$stateChangeStart', function(event, next) {
    Auth.isLoggedIn()
      .then((is) => {
        if (typeof next.authenticate === 'string') {
          Auth.hasRole(next.authenticate)
            .then(has => {
              if (!has) {
                event.preventDefault();
                $state.go(is ? 'main' : 'login');
              }
            });
        }

        if (is) {
          if (next.name === 'logout') {
            Auth.unsubscribe();
          }
          else if (!Auth.isSubscribed()) {
            Auth.subscribe();

          }
        }
        else if (next.authenticate) {
          event.preventDefault();
          $state.go('login');
        }
      });
  });
}
