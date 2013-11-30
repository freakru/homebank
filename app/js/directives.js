'use strict';

hbApp.directive('bDatepicker', function() {
    return {
        restrict: 'A',
        link: function(scope, el, attr) {
            el.datepicker();
        }
    };
});

$("#standalone").datepicker().on('changeDate', function(ev) {
    alert(ev.date)
});

