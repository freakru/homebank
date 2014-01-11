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
            rawTransactions.forEach(function(transaction) {
                var amount = parseFloat(transaction.amount, 10);
                
                if($scope.labels.indexOf(transaction.category) === -1) {
                    $scope.labels.push(transaction.category);
                }
                
                data.push(amount);
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