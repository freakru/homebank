'use strict';

var hbControllers = angular.module('hbControllers', []);

hbControllers.controller('TransactionCtrl', ['$scope', 'Transaction', 'Account', 'Category',
    function($scope, Transaction, Account, Category) {


        $scope.accounts = Account.query();
        $scope.categories = Category.query();

        $scope.transaction = new Transaction;

        $scope.save = function() {
            if (typeof $scope.transaction.id !== 'undefined') {
                //Transaction.update($scope.transaction);
                $scope.transaction.$update();
            } else {

                $scope.transaction.$save();
                //Transaction.create($scope.transaction);
            }
            $scope.fetch();
        };

        $scope.edit = function(transaction) {
            $scope.transaction = transaction;
        };

        $scope.cancel = function() {
            $scope.transaction = new Transaction;
        };

        $scope.fetch = function(callback) {

            $scope.transactions = Transaction.query({}, callback);
            $scope.orderProp = 'age';
        };

        $scope.remove = function(transaction) {
            transaction.$delete();
        };
        
        $scope.cssClass = function(amount) {
            amount = parseFloat(amount, 10);
            var cssClass = 'text-warning';
            if(amount > 0) {
                cssClass = 'text-success';
            } else if(amount < -99) {
                cssClass = 'text-danger';
            } else if(amount < -49) {
                cssClass = 'text-warning';                
            }
            return cssClass;
        }


        

    }]);

hbControllers.controller('TransactionDetailCtrl', ['$scope', '$routeParams', 'Transaction',
    function($scope, $routeParams, Transaction) {
        $scope.transaction = Transaction.get({transactionId: $routeParams.transactionId}, function(transaction) {
            $scope.mainImageUrl = transaction.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
}]);

