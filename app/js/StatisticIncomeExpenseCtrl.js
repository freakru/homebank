hbControllers.controller('StatisticIncomeExpenseCtrl', ['$scope', '$routeParams', 'utils', 'Transaction',
    function($scope, $routeParams, utils, Transaction) {

        $scope.year = moment().format('YYYY');

        $scope.fetch = function(callback) {
            $scope.labels = [];

            var param = {
                id: 'statisticIncomeExpense',
                year: $scope.year
            };
            Transaction.query(param, function(data) {
                $scope.transactions = data.items;

                $scope.series = $scope.transactions;
                callback();
            });
        };

        $scope.prepareBarchartData = function(rawTransactions) {

        };

        $scope.drawChart = function() {
            var count = 0;
            var months = [];
            while (count < 12) months.push(moment().month(count++).format("MMMM"));

            $scope.chart = {
                options: {
                    chart: {
                        type: 'column'
                    }
                },
                xAxis: {
                    categories: months,
                    title: {
                        text: null
                    }
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                },
                series: $scope.series,
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                legend: {
                    enabled: true
                },
                title: {
                },
                loading: false
            };
        };

        $scope.runQuery = function() {
            $scope.fetch($scope.drawChart);
        };

        $scope.setYear = function(year) {
            $scope.year = year;
            $scope.runQuery();
        };

        $scope.runQuery();
    }]);