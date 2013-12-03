hbControllers.controller('TransactionCtrl', ['$scope', 'Transaction', 'Account', 'Category',
    function($scope, Transaction, Account, Category) {

        $scope.totalItems = 0;
        $scope.currentPage = 1;
        $scope.maxSize = 10;

        $scope.setPage = function(page) {
            $scope.currentPage = page;
            $scope.fetch();
        };

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
            
            // select right account
            angular.forEach($scope.accounts, function(value, key) {
                if ($scope.accounts[key].name === $scope.transaction.account) {
                    $scope.transaction.account = $scope.accounts[key];
                    return false;
                }
            });
            
            // select right category
            angular.forEach($scope.categories, function(value, key) {
                if ($scope.categories[key].name === $scope.transaction.category.name) {
                    $scope.transaction.category = $scope.categories[key];
                    return false;
                }
            });
        };

        $scope.cancel = function() {
            $scope.transaction = new Transaction;
        };

        $scope.fetch = function() {
            var param = {
                limit: 10,
                page: $scope.currentPage
            };
            Transaction.query({id: 'balance'}, function(data) {
                $scope.balance = data.items;
            });

            Transaction.query(param, function(data) {
                $scope.totalItems = data.totalItems;
                $scope.transactions = data.items;
            });
            $scope.orderProp = 'age';
        };

        $scope.remove = function(transaction) {
            transaction.$delete();
        };

        $scope.cssClass = function(amount) {
            amount = parseFloat(amount, 10);
            var cssClass = 'text-warning';
            if (amount > 0) {
                cssClass = 'text-success';
            } else if (amount < -99) {
                cssClass = 'text-danger';
            } else if (amount < -49) {
                cssClass = 'text-warning';
            }
            return cssClass;
        };

        $scope.fetch();
    }]);