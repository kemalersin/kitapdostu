'use strict';

import constants from '../../app/app.constants';

/*@ngInject*/

export function itemsByTagsFilter(appConfig) {
  return function(items, tags, filter, paging, search, status) {
    const numPerPage = appConfig.pagination.itemsPerPage;

    let filtered = items.filter((element, index, array) => {
      let matching = _.has(element, 'matching');

      return (
          tags.length === 0 ||
          _.difference(tags, element.tags).length === 0
      ) && (
        !search || 
        _.includes(
          _.lowerCase(element.name),
          _.lowerCase(search)
        )
      ) && (
        !filter ||
        (filter === 1 && matching) || 
        (filter === 2 && !matching)
      ) && (
        filter !== 1 || (
          status && (
            (status.reading && element.reading) ||
            (status.completed && !element.reading) 
          )
        )
      );
    });
 
    let begin = ((paging.currentPage || 1) * 1 - 1) * numPerPage; 
    let end = begin + numPerPage;

    paging.totalItems = filtered.length;

    return filtered.slice(begin, end);
  };
}

export default angular.module('kitapdostuApp.itemsByTags', [constants])
  .filter('itemsByTags', itemsByTagsFilter)
  .name;
