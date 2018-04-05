'use strict';

import { routeConfig } from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import books from './books/books.component';
import book from './books/book/book.component';
import readers from './readers/readers.component';
import reader from './readers/reader/reader.component';
import matching from './matching/matching.component';
import constants from './app.constants';
import util from '../components/util/util.module';
import socket from '../components/socket/socket.service';

import itemsByTags from '../filters/itemsByTags/itemsByTags.filter.js';
import orderByLocale from '../filters/orderByLocale/orderByLocale.filter.js';

import anchor from '../directives/anchor/anchor.directive.js';
import autofocus from '../directives/autofocus/autofocus.directive.js';
import keepScrollPos from '../directives/keepScrollPos/keepScrollPos.directive.js';

import './app.scss';
import '../i18n/angular-locale_tr-tr';

angular.module('kitapdostuApp', [
  'ngCookies', 'ngResource', 'ngAnimate', 'ngSanitize', 'ngTagsInput', 'btford.socket-io', 'ui.router',
  'ui.bootstrap', 'validation.match', 'checklist-model', 'angular-loading-bar', 'ui-notification',
  'pascalprecht.translate', 'dialogs.main', 
  _Auth, account, admin, books, book, readers, reader, matching, navbar, footer, main, constants,
  socket, util, itemsByTags, orderByLocale, anchor, autofocus, keepScrollPos
])
  .config(routeConfig)
  .run(function($rootScope, $location, Auth) {
    'ngInject';

    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedIn(function(loggedIn) {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['kitapdostuApp'], {
      strictDi: true
    });
  });
