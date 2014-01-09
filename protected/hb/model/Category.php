<?php

namespace hb\model;

class Category extends Model {

    public function __construct() {
        parent::__construct();
    }
    
    public function get($column, $val) {
        $model = $this->db->category($column, $val)->fetch();
        return $model;
    }
    
    public function save($data) {
        $model = $this->db->category();
        
        if (isset($data['id'])) {
            $model = $this->db->category[$data['id']];
            return $model->update($data);
        }
        
        return $model->insert($data);
    }
}

