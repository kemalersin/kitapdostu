'use strict';

const uiRouter = require('angular-ui-router');

import { kebabCase } from 'lodash';
import routes from './reader.routes';

export class ReaderComponent {
  $http;
  $state;

  reader;
  isModal;
  initialized;

  constructor($http, $scope, $state) {
    'ngInject';

    this.$http = $http;
    this.$state = $state;

    this.isModal = $scope.reader !== undefined;

    $scope.kebabCase = kebabCase;

    if (this.isModal) {
      this.initialized = true;
      this.reader = $scope.reader;
    }
    else if (!$state.params.id) {
      return $state.go('main');
    }
  }

  $onInit(){
    if (!this.isModal) {
      this.$http.get('/api/readers/' + this.$state.params.id)
        .then(response => {
          this.initialized = true;
          this.reader = response.data;
        });
    }
  }
}

export default angular.module('kitapdostuApp.reader', [uiRouter])
  .config(routes)
  .component('reader', {
    template: require('./reader.pug'),
    controller: ReaderComponent,
    controllerAs: 'vm'
  })
  .name;
