'use strict';
const uiRouter = require('angular-ui-router');

import routes from './matching.routes';

export class MatchingComponent {
  $http;
  Notification;

  bookTags = null;
  readerTags = null;

  matching = null;
  remain = null;

  selectedTags;

  constructor($http, $scope, Notification) {
    'ngInject';

    this.$http = $http;
    this.Notification = Notification;
  }

  $onInit() {
    this.selectedTags = {
      book: [],
      reader: []
    };

    this.$http.get('/api/books/tags').then(response => {
      this.bookTags = response.data;
    });

    this.$http.get('/api/readers/tags').then(response => {
      this.readerTags = response.data;
    });
  }

  createMatching() {
    this.$http.post('/api/matchings/create', {
      bookTags: this.selectedTags.book,
      readerTags: this.selectedTags.reader
    })
      .then(response => {
        let data = response.data;

        this.matching = data.matching;
        this.remains = data.remains;
      })
      .catch((err) => {
        err.status === 404 ?
          this.Notification.error('Eşleştirilecek kayıt bulunamadı.') :
          this.Notification.error('Eşleştirme yapılamadı.');
      });
  }

  saveMatching() {
    let matching = _.map(this.matching, (item) => {
      return {
        book: item._id,
        reader: item.reader._id
      };
    });

    this.$http.post('/api/matchings/save', { matching })
      .then(response => {
        this.matching = null;
        this.Notification.success('Eşleştirme kaydedildi.');
      })
      .catch((err) => {
        this.Notification.error('Eşleştirme kaydedilemedi.');
      });
  }

  deleteMatch(match) {
    _.pull(this.matching, match);
  }
}

export default angular.module('kitapdostuApp.matching', [uiRouter])
  .config(routes)
  .component('matching', {
    template: require('./matching.pug'),
    controller: MatchingComponent,
    controllerAs: 'vm'
  })
  .name;
