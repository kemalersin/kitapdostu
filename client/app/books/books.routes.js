'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('books', {
      url: '/kitaplar/:filter/:status?e&a&s&k',
      authenticate: 'user',
      template: '<books></books>',
      params: {
        filter: {
          value: null,
          squash: true
        },
        status: {
          value: null,
          squash: true
        }
      }
    });
}
