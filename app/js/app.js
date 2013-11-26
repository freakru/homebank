'use strict';

/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'transactionControllers',
  'phonecatFilters',
  'hbServices',
  'angles'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/transactions', {
        templateUrl: 'partials/transaction/list.html',
        controller: 'TransactionCtrl'
      }).
      when('/transaction/:transactionId', {
        templateUrl: 'partials/transaction-detail.html',
        controller: 'TransactionDetailCtrl'
      }).
      otherwise({
        redirectTo: '/transactions'
      });
  }]);
