hbControllers.controller('AccountCtrl', ['$scope', 'Account',
    function($scope, Account) {
        
        $scope.account = new Account;

        $scope.fetch = function() {
            Account.query({}, function(data) {
                $scope.accounts = data;
            });
        };
        
        $scope.save = function() {
            if (typeof $scope.account.id !== 'undefined') {
                Account.update($scope.account);
                
            } else {
                $scope.account.$save();
            }
            $scope.fetch();
        };

        $scope.edit = function(account) {
            $scope.account = account;
        };

        $scope.cancel = function() {
            $scope.account = new Account;
        };
        
        $scope.remove = function(account) {
            account.$delete();
            $scope.fetch();
        };

        $scope.fetch();
    }]);