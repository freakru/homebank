<?php

namespace hb\model;

class Transaction extends Model {

    public function __construct() {
        parent::__construct();
    }
    
    public function save($data) {
        $transaction = $this->db->transaction();
        
        if (isset($data['id'])) {
            return $transaction->update($data);
        }
        
        return $transaction->insert($data);
    }
}
