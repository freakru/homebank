'use strict';

var hbControllers = angular.module('hbControllers', []);

hbControllers.controller('TransactionDetailCtrl', ['$scope', '$routeParams', 'Transaction',
    function($scope, $routeParams, Transaction) {
        $scope.transaction = Transaction.get({transactionId: $routeParams.transactionId}, function(transaction) {
            $scope.mainImageUrl = transaction.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
}]);

