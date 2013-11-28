'use strict';

/* App Module */

var hbApp = angular.module('hbApp', [
  'ngRoute',
  'phonecatAnimations',

  'hbControllers',
  'phonecatFilters',
  'hbServices',
  'angles'
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
      otherwise({
        redirectTo: '/transactions'
      });
  }]);
