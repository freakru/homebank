<?php

namespace hb;

class CategoryController extends Controller {
    
    public function get($id) {
        $db = $this->getDb();
        $category = $db->category[$id];
        $result = array();

        $result[] = array(
            'id' => $category['id'],
            'name' => $category['name'],
            'symbol' => $category['symbol']
        );

        echo json_encode($result);
    }

    public function index() {
        $db = $this->getDb();
        $categories = $db->category()->order('name');
        $result = array();
        if ($categories === null) {
            echo json_encode($result);
            return false;
        }
        foreach ($categories as $category) {
            $result[] = array(
                'id' => $category['id'],
                'name' => $category['name'],
                'symbol' => $category['symbol']
            );
        }
        echo json_encode($result);
    }
}
