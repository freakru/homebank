'use strict';

/* Controllers */

var transactionControllers = angular.module('transactionControllers', []);

transactionControllers.controller('TransactionCtrl', ['$scope', 'Transaction', 'Account', 'Category',
    function($scope, Transaction, Account, Category) {


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
        };

        $scope.cancel = function() {
            $scope.transaction = new Transaction;
        };

        $scope.fetch = function(callback) {

            $scope.transactions = Transaction.query({}, callback);
            $scope.orderProp = 'age';
        };

        $scope.remove = function(transaction) {
            transaction.$delete();
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

            $scope.myChartOptions = {
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

            $scope.chart = {
                labels: labels,
                datasets: [{
                        fillColor : "rgba(220,220,220,0.5)",
			strokeColor : "rgba(220,220,220,1)",
                        data: data
                    }
                ],
            };
        };

        $scope.fetch($scope.drawChart);

    }]);

transactionControllers.controller('TransactionDetailCtrl', ['$scope', '$routeParams', 'Transaction',
    function($scope, $routeParams, Transaction) {
        $scope.transaction = Transaction.get({transactionId: $routeParams.transactionId}, function(transaction) {
            $scope.mainImageUrl = transaction.images[0];
        });

        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        }
    }]);
