<?php

namespace hb\model;

class Transaction extends Model {

    public function __construct() {
        parent::__construct();
    }
    
    public function save($data) {
        $transaction = $this->db->transaction();
        $data['date'] = \hb\util\DateUtil::formatMysql($data['date']);
        
        if (isset($data['id'])) {
            $transaction = $this->db->transaction[$data['id']];
            return $transaction->update($data);
        }
        
        return $transaction->insert($data);
    }
}
