'use strict';

export function UtilService($window, appConfig) {
  'ngInject';

  var Util = {
    safeCb(cb) {
      return angular.isFunction(cb) ? cb : angular.noop;
    },

    urlParse(url) {
      var a = document.createElement('a');
      a.href = url;

      if(a.host === '') {
        a.href = a.href;
      }

      return a;
    },

    isSameOrigin(url, origins) {
      url = Util.urlParse(url);
      origins = origins && [].concat(origins) || [];
      origins = origins.map(Util.urlParse);
      origins.push($window.location);
      origins = origins.filter(function(o) {
        let hostnameCheck = url.hostname === o.hostname;
        let protocolCheck = url.protocol === o.protocol;
        let portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port
          === '443');
        return hostnameCheck && protocolCheck && portCheck;
      });
      return origins.length >= 1;
    },


    getTags(items, tagSet, query) {
      let tags = _(items)
        .map('tags')
        .flatten()
        .sort((a, b) => {
          return a.localeCompare(b);
        })
        .sortedUniq()
        .filter((tag) => {
          return !query || _.includes(_.toLower(tag), _.toLower(query));
        })
        .value();

      if (tagSet && items[0]) {
        let diff = _.difference(tagSet.tags, tags);

        tagSet.tags = tagSet.tags.filter((tag) => {
          return !_.includes(diff, tag); 
        });
      }

      return tags;
    },

    getRowNr(index, currentPage) {
      return (
          index + (
            (
             (currentPage || 1) - 1
            ) * appConfig.pagination.itemsPerPage
          )
      ) + 1;
    }
  };

  return Util;
}
