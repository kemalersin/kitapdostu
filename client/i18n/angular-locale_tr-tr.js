'use strict';
angular.module("ngLocale", [], ["$provide", function($provide) {
  var PLURAL_CATEGORY = {
    ZERO: "zero",
    ONE: "one",
    TWO: "two",
    FEW: "few",
    MANY: "many",
    OTHER: "other"
  };
  $provide.value("$locale", {
    "DATETIME_FORMATS": {
      "AMPMS": [
        "ÖÖ",
        "ÖS"
      ],
      "DAY": [
        "Pazar",
        "Pazartesi",
        "Salı",
        "Çarşamba",
        "Perşembe",
        "Cuma",
        "Cumartesi"
      ],
      "ERANAMES": [
        "Milattan Önce",
        "Milattan Sonra"
      ],
      "ERAS": [
        "MÖ",
        "MS"
      ],
      "FIRSTDAYOFWEEK": 0,
      "MONTH": [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık"
      ],
      "SHORTDAY": [
        "Paz",
        "Pzt",
        "Sal",
        "Çar",
        "Per",
        "Cum",
        "Cmt"
      ],
      "SHORTMONTH": [
        "Oca",
        "Şub",
        "Mar",
        "Nis",
        "May",
        "Haz",
        "Tem",
        "Ağu",
        "Eyl",
        "Eki",
        "Kas",
        "Ara"
      ],
      "STANDALONEMONTH": [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık"
      ],
      "WEEKENDRANGE": [
        5,
        6
      ],
      "fullDate": "d MMMM y EEEE",
      "longDate": "d MMMM y",
      "medium": "d MMM y HH:mm:ss",
      "mediumDate": "d MMM y",
      "mediumTime": "HH:mm:ss",
      "short": "d MM y HH:mm",
      "shortDate": "d MM y",
      "shortTime": "HH:mm"
    },
    "NUMBER_FORMATS": {
      "CURRENCY_SYM": "TL",
      "DECIMAL_SEP": ",",
      "GROUP_SEP": ".",
      "PATTERNS": [{
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 3,
        "minFrac": 0,
        "minInt": 1,
        "negPre": "-",
        "negSuf": "",
        "posPre": "",
        "posSuf": ""
      }, {
        "gSize": 3,
        "lgSize": 3,
        "maxFrac": 2,
        "minFrac": 2,
        "minInt": 1,
        "negPre": "-",
        "negSuf": " ¤",
        "posPre": "",
        "posSuf": " ¤"
      }]
    },
    "id": "tr-tr",
    "localeID": "tr_TR",
    "pluralCat": function(n, opt_precision) {
      if (n == 1) {
        return PLURAL_CATEGORY.ONE;
      }
      return PLURAL_CATEGORY.OTHER;
    }
  });
}]);
