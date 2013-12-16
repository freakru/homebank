hbApp.factory('utils', function() {
    return {
        getFirstDayOfWeek: function() {
            return moment().startOf('week').format('DD.MM.YYYY');
        }, 
        getLastDayOfWeek: function() {
            return moment().endOf('week').format('DD.MM.YYYY');
        },
        getFirstDayOfMonth: function() {
            return moment().startOf('month').format('DD.MM.YYYY');
        },
        getLastDayOfMonth: function() {
            return moment().endOf('month').format('DD.MM.YYYY');
        },
        getFirstDayOfYear: function() {
            return moment().startOf('year').format('DD.MM.YYYY');
        },
        getLastDayOfYear: function() {
            return moment().endOf('year').format('DD.MM.YYYY');
        },
        getDecColor: function() {
            var color = (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256));
            return color;
        },
        getHexColor: function() {
            var color = '';
            for(;;) {
                color = "#" + Math.random().toString(16).slice(2, 8);
                if (color !== '#ffffff') {
                    break;
                }
            }
            return color;
            
        }
    };
});