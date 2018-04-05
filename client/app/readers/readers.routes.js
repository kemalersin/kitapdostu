'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('readers', {
      url: '/okuyucular/:filter/:status?e&a&s&k',
      authenticate: 'user',
      template: '<readers></readers>',
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
