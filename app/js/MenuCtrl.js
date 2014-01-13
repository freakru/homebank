hbControllers.controller('MenuCtrl', ['$scope',
    function($scope) {
        $scope.menuItems = [
            {
                link: '#/overview', title: 'Overview'
            },
            {
                link: '#/transactions', title: 'Transactions'
            },
            {
                link: '#/statistic/bar', title: 'Statistic'
            },
            {
                link: '#/import', title: 'Import'
            },
            {
                link: '#/category', title: 'Categories'
            },
            {
                link: '#/account', title: 'Accounts'
            }
        ];
}]);
