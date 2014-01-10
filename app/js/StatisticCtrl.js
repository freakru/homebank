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
            $scope.orderProp = 'age';
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

        $scope.drawBarchart = function() {
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

        $scope.drawPiechart = function() {
            var data = [];
            if (!$scope.transactions) {
                return false;
            }
            $scope.transactions.forEach(function(transaction) {
                var amount = parseFloat(transaction.amount, 10);
                if (amount > 0) {
                    return;
                }
                var item = {
                    value: amount,
                    color: utils.getHexColor(),
                    label: transaction.category,
                    labelColor: 'white',
                    labelFontSize: '16'
                };
                data.push(item);
            });

            $scope.piechartOptions = {
                animation: false
            };

            $scope.piechart = data;
        };

        $scope.runQuery = function() {
            $scope.type = $routeParams.type;
            if ($scope.type === 'piechart') {
                $scope.fetch($scope.drawPiechart);
            } else {
                $scope.fetch($scope.drawBarchart);
            }            
        };
        
        $scope.addBarchartData = function() {
            $scope.period.startdate = '01.01.2012';
            $scope.period.enddate = '31.12.2012';
            $scope.fetch(function() {
                
            });
        };

        $scope.runQuery();
        //$scope.addBarchartData();
    }]);