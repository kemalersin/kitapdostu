'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('matching', {
      url: '/eslestirme',
      authenticate: 'user',
      template: '<matching></matching>'
    });
}
