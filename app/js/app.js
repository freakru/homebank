'use strict';

/* App Module */

var hbApp = angular.module('hbApp', [
  'ngRoute',
  'phonecatAnimations',
  'hbControllers',
  'phonecatFilters',
  'hbServices',
  'highcharts-ng',
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
      when('/statistic/:type', {
        templateUrl: 'partials/statistic/index.html',
        controller: 'StatisticCtrl'
      }).              
      when('/statisticIncomeExpense', {
        templateUrl: 'partials/statistic/incomeExpense.html',
        controller: 'StatisticIncomeExpenseCtrl'
      }).
      when('/transaction/:transactionId', {
        templateUrl: 'partials/transaction-detail.html',
        controller: 'TransactionDetailCtrl'
      }).
      when('/import', {
        templateUrl: 'partials/import/index.html',
        controller: 'ImportCtrl'
      }).
      when('/category', {
        templateUrl: 'partials/category/index.html',
        controller: 'CategoryCtrl'
      }).
      when('/account', {
        templateUrl: 'partials/account/index.html',
        controller: 'AccountCtrl'
      }).
      otherwise({
        redirectTo: '/transactions'
      });
  }]);
