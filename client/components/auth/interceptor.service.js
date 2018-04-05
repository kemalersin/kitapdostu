'use strict';

export function authInterceptor($rootScope, $q, $cookies, $injector, Util) {
  'ngInject';

  var state;
  var httpRequests = 0;

  function updateHttpRequest(inc) {
    inc ?
      httpRequests++ :
      httpRequests--;

    if (httpRequests < 0) {
      httpRequests = 0;
    }

    $rootScope.waitingForHttp = inc || (httpRequests !== 0);
  }

  return {
    // Add authorization token to headers
    request(config) {
      config.headers = config.headers || {};

      if (!config.noWaitForHttp) {
        updateHttpRequest(true);
      }

      if($cookies.get('token') && Util.isSameOrigin(config.url)) {
        config.headers.Authorization = `Bearer ${$cookies.get('token')}`;
      }

      return config;
    },

    requestError: function (error) {
      updateHttpRequest();
      return $q.reject(error);
    },

    response: function (response) {
      updateHttpRequest();
      return response;
    },


    // Intercept 401s and redirect you to login
    responseError(response) {
      updateHttpRequest();

      if(response.status === 401) {
        (state || (state = $injector.get('$state')))
          .go('login');
        // remove any stale tokens
        $cookies.remove('token');
      }

      return $q.reject(response);
    }
  };
}
