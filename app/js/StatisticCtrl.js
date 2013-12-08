hbControllers.controller('StatisticCtrl', ['$scope', 'utils', 'Transaction',
    function($scope, utils, Transaction) {

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
            var param = {
                id: 'statistic',
                startdate: $scope.period.startdate,
                enddate: $scope.period.enddate
            };
            Transaction.query(param, function(data) {
                $scope.transactions = data.items;
                callback();
            });
            $scope.orderProp = 'age';
        };

        $scope.drawBarchart = function() {
            var labels = [];
            var data = [];
            var sum = 2800;
            $scope.transactions.forEach(function(transaction) {
                sum += parseFloat(transaction.amount, 10);
                labels.push(transaction.date);
                data.push(sum);
            });

            $scope.barchartOptions = {
                //Boolean - Whether we should show a stroke on each segment
                segmentShowStroke: true,
                //String - The colour of each segment stroke
                segmentStrokeColor: "#fff",
                //Number - The width of each segment stroke
                segmentStrokeWidth: 24,
                //The percentage of the chart that we cut out of the middle.
                percentageInnerCutout: 50,
                //Boolean - Whether we should animate the chart
                animation: true,
                //Number - Amount of animation steps
                animationSteps: 100,
                //String - Animation easing effect
                animationEasing: "easeOutBounce",
                //Boolean - Whether we animate the rotation of the Doughnut
                animateRotate: true,
                //Boolean - Whether we animate scaling the Doughnut from the centre
                animateScale: false,
                //Function - Will fire on animation completion.
                onAnimationComplete: null
            };

            $scope.barchart = {
                labels: labels,
                datasets: [{
                        fillColor: "rgba(220,220,220,0.5)",
                        strokeColor: "rgba(220,220,220,1)",
                        data: data
                    }
                ],
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
                    color: '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
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
            $scope.fetch($scope.drawPiechart);
        };

        $scope.setPeriod = function() {
            if ($scope.period.id === 1) {
                $scope.param.startdate = utils.getFirstDayOfYear();
                $scope.param.enddate = utils.getLastDayOfYear();
            }
            if ($scope.period.id === 5) {
                $scope.param.startdate = utils.getFirstDayOfYear();
                $scope.param.enddate = utils.getLastDayOfYear();
            }
        };

        $scope.runQuery();
    }]);