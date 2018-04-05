'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  menu = [{
    title: 'Ana Sayfa',
    state: 'main'
  }, {
    title: 'Kitaplar',
    state: 'books',
    authenticate: true
  }, {
    title: 'Okuyucular',
    state: 'readers',
    authenticate: true
  }, {
    title: 'Eşleştirme',
    state: 'matching',
    authenticate: true
  }];
  isLoggedIn: Function;
  isAdmin: Function;
  getCurrentUser: Function;
  isCollapsed = true;

  constructor(Auth) {
    'ngInject';

    this.isLoggedIn = Auth.isLoggedInSync;
    this.isAdmin = Auth.isAdminSync;
    this.getCurrentUser = Auth.getCurrentUserSync;
  }

}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
