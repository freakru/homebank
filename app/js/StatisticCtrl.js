hbControllers.controller('StatisticCtrl', ['$scope', '$routeParams', 'utils', 'Transaction',
    function($scope, $routeParams, utils, Transaction) {

        $scope.periods = [
            {
                title: 'last week',
                startdate: utils.getFirstDayOfWeek(),
                enddate: utils.getLastDayOfWeek()
            },
            {
                title: 'last month',
                startdate: utils.getFirstDayOfMonth(),
                enddate: utils.getLastDayOfMonth()
            },
            {
                title: 'last year',
                startdate: utils.getFirstDayOfYear(),
                enddate: utils.getLastDayOfYear()
            }
        ];

        $scope.period = $scope.periods[1];

        $scope.fetch = function(callback) {
            $scope.labels = [];
            $scope.datasets = [];

            var param = {
                id: 'statistic',
                startdate: $scope.period.startdate,
                enddate: $scope.period.enddate
            };
            Transaction.query(param, function(data) {
                $scope.transactions = data.items;

                $scope.transactions.sort(function(a, b) {
                    return a['amount'] < b['amount'];
                });

                $scope.prepareBarchartData($scope.transactions);
                callback();
            });
        };

        $scope.prepareBarchartData = function(rawTransactions) {

            var data = [];
            $scope.sum = 0;
            rawTransactions.forEach(function(transaction) {
                $scope.sum += transaction.amount;
            });

            rawTransactions.forEach(function(transaction) {
                var amount = parseFloat(transaction.amount, 10);

                if ($scope.type === 'pie') {
                    amount = amount / $scope.sum * 100;
                }

                if ($scope.labels.indexOf(transaction.category) === -1) {
                    $scope.labels.push(transaction.category);
                }

                data.push([transaction.category, amount]);
            });
            $scope.datasets = data;
        };

        $scope.drawChart = function() {
            $scope.chart = {
                options: {
                    chart: {
                        type: $scope.type
                    }
                },
                xAxis: {
                    categories: $scope.labels
                },
                yAxis: {
                    title: {
                        enabled: false
                    }
                },
                series: [{
                        data: $scope.datasets
                    }],
                plotOptions: {
                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    pie: {
                        dataLabels: {
                            enabled: true,
                            formatter: function() {
                                return this.key + ': ' + Highcharts.numberFormat(this.y, 2) + '%';
                            }
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                title: {
                    text: $scope.period.startdate + ' - ' + $scope.period.enddate
                },
                loading: false
            };
        };

        $scope.runQuery = function() {
            $scope.type = $routeParams.type;
            $scope.fetch($scope.drawChart);
        };

        $scope.runQuery();
    }]);