'use strict';

/* Services */

var hbServices = angular.module('hbServices', ['ngResource']);

hbServices.factory('Transaction', ['$resource',
    function($resource) {
        return $resource('../index.php/api/transaction/:id', {}, {
            query: { method: 'GET', params: {id: ''}, isArray: false},
            create: { method: 'POST'},
            update: { method: 'PUT', params: {id: '@id'} },
            delete: { method: 'DELETE', params: {id: '@id'} }
        });
}])
.factory('Account', ['$resource',
    function($resource) {
        return $resource('../index.php/api/account/:id', {}, {
            query: {
                method: 'GET',
                params: {id: ''},
                isArray: true
            }
        });
}])

.factory('Category', ['$resource',
    function($resource) {
        return $resource('../index.php/api/category/:id', {}, {
            query: {
                method: 'GET',
                params: {id: ''},
                isArray: true
            }
        });
}]);
