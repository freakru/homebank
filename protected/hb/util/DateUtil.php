<?php

namespace hb\util;

class DateUtil {
    /**
     * formats mysql date to german
     * @param type $mysqlDate
     * @return type
     */
    public static function formatGerman($mysqlDate) {
        $dateRaw = explode(' ', $mysqlDate);
        $dateArr = explode('-', $dateRaw[0]);
        return $dateArr[2] . '.' . $dateArr[1] . '.' . $dateArr[0];
    }
    
    /**
     * formats german date to mysql
     * @param type $germanDate
     * @return type
     */
    public static function formatMysql($germanDate) {
        $dateArr = explode('.', $germanDate);
        return $dateArr[2] . '-' . $dateArr[1] . '-' . $dateArr[0] . ' 00:00:00';
    }
    
    /**
     * calculates last date of month based on given date in german format
     * @param type $germanDate
     */
    public static function calcLastDateOfMonth($germanDate) {
        $dateArr = explode('.', $germanDate);
        $result = strtotime($dateArr[2] . '-' . $dateArr[1] . '-01');
        $result = strtotime('-1 day', strtotime('+1 month', $result));
        return date('Y-m-d', $result);
    }
}
