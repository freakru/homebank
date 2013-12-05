'use strict';

/* App Module */

var hbApp = angular.module('hbApp', [
  'ngRoute',
  'phonecatAnimations',
  'hbControllers',
  'phonecatFilters',
  'hbServices',
  'angles',
  'ui.bootstrap',
  'angularFileUpload'
]);

hbApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'partials/transaction/list.html',
        controller: 'TransactionCtrl'
      }).
      when('/transactions', {
        templateUrl: 'partials/transaction/list.html',
        controller: 'TransactionCtrl'
      }).
      when('/statistic', {
        templateUrl: 'partials/statistic/index.html',
        controller: 'StatisticCtrl'
      }).              
      when('/transaction/:transactionId', {
        templateUrl: 'partials/transaction-detail.html',
        controller: 'TransactionDetailCtrl'
      }).
      when('/import', {
        templateUrl: 'partials/import/index.html',
        controller: 'ImportCtrl'
      }).
      otherwise({
        redirectTo: '/transactions'
      });
  }]);
