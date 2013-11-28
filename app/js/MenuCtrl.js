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
                link: '#/statistic', title: 'Statistic'
            }
        ];
}]);
