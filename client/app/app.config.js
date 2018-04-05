'use strict';

export function routeConfig($urlRouterProvider, $locationProvider, $translateProvider, dialogsProvider, tagsInputConfigProvider) {
  'ngInject';

  $urlRouterProvider.otherwise('/');

  $locationProvider.html5Mode(true);

  tagsInputConfigProvider.setDefaults('tagsInput', {
    placeholder: 'Yeni etiket',
    replaceSpacesWithDashes: false
  });

  $translateProvider.translations('tr', {
    DIALOGS_ERROR: 'Hata',
    DIALOGS_ERROR_MSG: 'Bilinmeyen bir hata oluştu.',
    DIALOGS_CLOSE: 'Kapat',
    DIALOGS_PLEASE_WAIT: 'Lütfen bekleyiniz',
    DIALOGS_PLEASE_WAIT_ELIPS: 'Lütfen bekleyiniz...',
    DIALOGS_PLEASE_WAIT_MSG: 'İşlemin tamamlanması bekleniyor.',
    DIALOGS_PERCENT_COMPLETE: '% tamamlandı',
    DIALOGS_NOTIFICATION: 'Bilgi',
    DIALOGS_NOTIFICATION_MSG: 'Bilinmeyen uygulama bildirimi.',
    DIALOGS_CONFIRMATION: 'Onay',
    DIALOGS_CONFIRMATION_MSG: 'Onay gerekiyor.',
    DIALOGS_OK: 'Tamam',
    DIALOGS_YES: 'Evet',
    DIALOGS_NO: 'Hayır'
  });

  $translateProvider.preferredLanguage('tr');
  $translateProvider.useSanitizeValueStrategy(null);

  dialogsProvider.useClass('ng-dialog');
  dialogsProvider.useAnimation(true);
  dialogsProvider.setSize('sm');
}
