hbControllers.controller('ImportCtrl', ['$scope', '$upload',
    function($scope, $upload) {
        $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                var $file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/homebank/index.php/api/transaction/import',
                    data: {myObj: $scope.myModelObj},
                    file: $file,
                }).progress(function(evt) {
                    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function(data, status, headers, config) {
                    console.log(data);
                });
                //.error(...)
                //.then(success, error, progress); 
            }
        };
    }]);
