import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;
  Auth;
  isLoggedIn;
  
  /*@ngInject*/
  
  constructor($http, $scope, Auth/*, socket*/) {
    this.$http = $http;
    this.Auth = Auth;
  }

  $onInit() {
    this.Auth.isLoggedIn()
      .then(is => this.isLoggedIn = is);
  }
}

export default angular.module('kitapdostuApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
