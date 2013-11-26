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
}
