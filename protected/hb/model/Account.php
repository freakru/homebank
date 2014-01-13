<?php

namespace hb\model;

class Account extends Model {

    public function __construct() {
        parent::__construct();
    }
    
    public function get($column, $val) {
        $model = $this->db->account($column, $val)->fetch();
        return $model;
    }
    
    public function save($data) {
        $model = $this->db->account();
        
        if (isset($data['id'])) {
            $model = $this->db->account[$data['id']];
            return $model->update($data);
        }
        
        return $model->insert($data);
    }
}

