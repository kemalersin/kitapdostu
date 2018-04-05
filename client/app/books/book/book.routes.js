'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('book', {
      url: '/kitap/:name/:id',
      authenticate: 'user',
      template: '<book></book>'
    });
}
