'use strict';

/*@ngInject*/
export function orderByLocaleFilter() {
  return function(array, property, reverse) {
    let clone = _.clone(array);

    let result = !clone ? clone : clone.sort((a, b) => {
      if (_.isUndefined(property)) {
        return a.localeCompare(b);
      }

      return _.get(a, property)
        .localeCompare(_.get(b, property));
    });

    return reverse ? _.reverse(result) : result;
  };
}


export default angular.module('kitapdostuApp.orderByLocale', [])
  .filter('orderByLocale', orderByLocaleFilter)
  .name;
