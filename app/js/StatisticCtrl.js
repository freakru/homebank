hbControllers.controller('StatisticCtrl', ['$scope', 'Transaction',
    function($scope, Transaction) {

        $scope.fetch = function(callback) {
            $scope.transactions = Transaction.query({}, callback);
            $scope.orderProp = 'age';
        };

        $scope.drawChart = function() {
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

            $scope.piechart = [
                {
                    value: 25,
                    color: "#F7464A"
                    ,
                label : 'Sleep',
                labelColor : 'white',
                labelFontSize : '16'
                },
                {
                    value: 35,
                    color: "#F74fff",
                label : 'Sleep',
                labelColor : 'white',
                labelFontSize : '16'
                },
            ];
        };

        $scope.fetch($scope.drawChart);
    }]);