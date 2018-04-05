'use strict';
const uiRouter = require('angular-ui-router');

import { kebabCase } from 'lodash';
import routes from './books.routes';

import { BookComponent } from './book/book.component';

export class BooksComponent {
  $http;
  $scope;
  $state;
  $timeout;
  $uibModal;

  socket;
  dialogs;

  Util;

  bookId;
  
  books = [];

  tagSet = {
    tags: []
  };

  search;
  filter = 2;

  paging = {
    currentPage: Number,
    totalItems: Number
  };

  status: {
    reading: boolean,
    completed: boolean
  } = {
    reading: true,
    completed: true
  };

  newBook = '';
  initialized;

  getTags: Function;
  getRowNr: Function;

  constructor($http, $scope, $state, $timeout, $uibModal, socket, appConfig, dialogs, Util) {
    'ngInject';

    const states = ['okunanlar', 'tamamlananlar'];
    const filters = ['tumu', 'eslesenler', 'eslesmeyenler'];

    this.$http = $http;
    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;

    this.socket = socket;
    this.dialogs = dialogs;
    this.getTags = Util.getTags;
    this.getRowNr = Util.getRowNr;

    this.search = $state.params.a;
    this.bookId = $state.params.k;
    this.paging.currentPage = $state.params.s;

    this.tagSet.tags = _.split($state.params.e, ',');
    this.filter = _.indexOf(filters, $state.params.filter || filters[2]);

    $scope.kebabCase = kebabCase;
    $scope.appConfig = appConfig;

    if (this.filter === 1) {
      this.status.reading = _.includes($state.params.status, states[0]);
      this.status.completed = _.includes($state.params.status, states[1]);
    }

    $scope.$on('$destroy', () => {
      socket.unsyncUpdates('book');
    });
    
    $scope.$watch(() => {
      const getSearch = () => this.search;
      const getBookId = () => this.bookId;
      const getTags = () => _.join(this.tagSet.tags);
      const getFilter = () => this.filter === 2 ? null : filters[this.filter];
      const getPage = () => this.paging.currentPage === 1 ? null : this.paging.currentPage;

      const getStatus = () => {
        if (this.filter !== 1) {
          return;
        }

        let result = [];

        if (this.status.reading) {
          result.push(states[0]);
        }

        if (this.status.completed) {
          result.push(states[1]);  
        }

        return _.join(result);
      };

      return {
        e: getTags(),
        s: getPage(), 
        k: getBookId(),
        a: getSearch(),
        filter: getFilter(),
        status: getStatus()
      };
    }, (newParams, oldParams) => {
      if (this.initialized &&
          newParams.k === oldParams.k &&
          newParams.s &&
          newParams.s === oldParams.s) {
        return this.paging.currentPage = null;
      }

      $state.go('books', newParams, { notify: false });
    }, true);
  }

  $onInit(){
    this.$http.get('/api/books').then(response => {
      this.initialized = true;
      this.books = response.data;
      this.socket.syncUpdates('book', this.books);

      if (this.bookId) {
        this.showBook();
      }
    });
  }

  addBook() {
    if (this.newBook) {
      this.$http.post('/api/books', { name: this.newBook });
      this.newBook = '';
    }
  }

  showBook(book) {
    if (book) {
      this.bookId = book._id;
    }

    this.$http.get('/api/books/' + this.bookId)
      .then(response => {
        let bookScope = this.$scope.$new(true);

        _.merge(bookScope, { book: response.data });

        this.$uibModal.open({
          scope: bookScope,
          windowClass: 'info',
          backdrop: 'static',
          controllerAs: 'vm',
          controller: BookComponent,
          template: require('./book/book.pug')
        }).result.then(angular.noop, () => {
          this.bookId = null; 
        });
      });
  }

  updateBookTags(tag, book) {
    this.$timeout(() => {
      this.$http.put('/api/books/' + book._id,
        { tags: book.tags },
        { ignoreLoadingBar: true }
      );
    }, 500)
  }

  deleteBook(book) {
    this.dialogs.confirm('Dikkat', 'Kitap silinsin mi?').result.then(() => {
      this.$http.delete('/api/books/' + book._id);
    });
  }

  deleteMatching(matching) {
    this.dialogs.confirm('Dikkat', 'Eşleştirme silinsin mi?').result.then(() => {
      this.$http.delete('/api/matchings/' + matching._id);
    });
  }
  
  finishMatching(matching) {
    this.dialogs.confirm('Dikkat', 'Okuyucu kitabı okumayı bitirdi mi?').result.then(() => {
      this.$http.post('/api/matchings/finish', { _id: matching._id });
    });
  }
}

export default angular.module('kitapdostuApp.books', [uiRouter])
  .config(routes)
  .component('books', {
    template: require('./books.pug'),
    controller: BooksComponent,
    controllerAs: 'vm'
  })
  .name;
