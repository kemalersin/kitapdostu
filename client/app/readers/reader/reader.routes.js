'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('reader', {
      url: '/okuyucu/:name/:id',
      authenticate: 'user',
      template: '<reader></reader>'
    });
}
