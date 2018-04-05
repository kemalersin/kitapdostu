'use strict';

const uiRouter = require('angular-ui-router');

import { kebabCase } from 'lodash';
import routes from './readers.routes';

import { ReaderComponent } from './reader/reader.component';

export class ReadersComponent {
  $http;
  $scope;
  $state;
  $timeout;
  $uibModal;

  socket;
  dialogs;

  Util;

  readerId;
  
  readers = [];

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

  newReader = '';
  initialized;

  getTags: Function;
  getRowNr: Function;

  constructor($http, $scope, $state, $timeout, $uibModal, socket, appConfig, dialogs, Util) {
    'ngInject';

    const states = ['okuyanlar', 'tamamlayanlar'];
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
    this.readerId = $state.params.k;
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
      socket.unsyncUpdates('reader');
    });
    
    $scope.$watch(() => {
      const getSearch = () => this.search;
      const getReaderId = () => this.readerId;
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
        a: getSearch(),
        k: getReaderId(), 
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

      $state.go('readers', newParams, { notify: false });
    }, true);
  }

  $onInit(){
    this.$http.get('/api/readers').then(response => {
      this.initialized = true;
      this.readers = response.data;
      this.socket.syncUpdates('reader', this.readers);

      if (this.readerId) {
        this.showReader();
      }
    });
  }

  addReader() {
    if (this.newReader) {
      this.$http.post('/api/readers', { name: this.newReader });
      this.newReader = '';
    }
  }

  showReader(reader) {
    if (reader) {
      this.readerId = reader._id;
    }

    this.$http.get('/api/readers/' + this.readerId)
      .then(response => {
        let readerScope = this.$scope.$new(true);

        _.merge(readerScope, { reader: response.data });

        this.$uibModal.open({
          scope: readerScope,
          windowClass: 'info',
          backdrop: 'static',
          controllerAs: 'vm',
          controller: ReaderComponent,
          template: require('./reader/reader.pug')
        }).result.then(angular.noop, () => {
          this.readerId = null; 
        });
      });
  }

  updateReaderTags(tag, reader) {
    this.$timeout(() => {
      this.$http.put('/api/readers/' + reader._id,
        { tags: reader.tags },
        { ignoreLoadingBar: true }
      );
    }, 500)
  }

  deleteReader(reader) {
    this.dialogs.confirm('Dikkat', 'Okuyucu silinsin mi?').result.then(() => {
      this.$http.delete('/api/readers/' + reader._id);
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

export default angular.module('kitapdostuApp.readers', [uiRouter])
  .config(routes)
  .component('readers', {
    template: require('./readers.pug'),
    controller: ReadersComponent,
    controllerAs: 'vm'
  })
  .name;
