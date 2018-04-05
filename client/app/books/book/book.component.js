'use strict';

const uiRouter = require('angular-ui-router');

import { kebabCase } from 'lodash';
import routes from './book.routes';

export class BookComponent {
  $http;
  $state;

  book;
  isModal;
  initialized;

  constructor($http, $scope, $state) {
    'ngInject';

    this.$http = $http;
    this.$state = $state;

    this.isModal = $scope.book !== undefined;

    $scope.kebabCase = kebabCase;

    if (this.isModal) {
      this.book = $scope.book;
      this.initialized = true;
    }
    else if (!$state.params.id) {
      return $state.go('main');
    }
  }

  $onInit(){
    if (!this.isModal) {
      this.$http.get('/api/books/' + this.$state.params.id)
        .then(response => {
          this.book = response.data;
          this.initialized = true;
        });
    }
  }
}

export default angular.module('kitapdostuApp.book', [uiRouter])
  .config(routes)
  .component('book', {
    template: require('./book.pug'),
    controller: BookComponent,
    controllerAs: 'vm'
  })
  .name;
