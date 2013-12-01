'use strict';

hbApp.directive('bDatepicker', function() {
    return {
        require: 'ngModel',
        link: function(scope, el, attr, ngModel) {
            el.datepicker({
                weekStart: 1
            }).on('changeDate', function(e) {
                scope.$apply(function() {
                    var date = moment(e.date).format('DD.MM.YYYY');
                    ngModel.$setViewValue(date);
                });
            });
        }
    };
});

