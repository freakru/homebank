<?php

namespace hb\util;

class CategoryUtil {

    function parseCategory($rawCategory) {
        $categoryName = 'Anderes';
        if (strstr($rawCategory, 'ELLER-MONTAN') || strstr($rawCategory, 'TANKSTELLE')) {
            $categoryName = 'Auto';
        }
        if (strstr($rawCategory, 'NETTO-EINFACH') || strstr($rawCategory, 'KAUFPARK')) {
            $categoryName = 'Lebensmittel';
        }
        if (strstr($rawCategory, 'ELENA MAER') || strstr($rawCategory, 'STADTWERKE')) {
            $categoryName = 'Haus';
        }
        if (strstr($rawCategory, 'O2') || strstr($rawCategory, 'UNITYMEDIA')) {
            $categoryName = 'Telefon';
        }
        if (strstr($rawCategory, 'BITMARCK')) {
            $categoryName = 'Gehalt';
        }
        return $categoryName;
    }

}
