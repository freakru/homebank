<?php

namespace hb;

class CategoryController extends Controller {

    public function index() {
        $db = $this->getDb();
        $categories = $db->category();
        $result = array();
        if ($categories === null) {
            echo json_encode($result);
            return false;
        }
        foreach ($categories as $category) {
            $result[] = array(
                'id' => $category['id'],
                'name' => $category['name']
            );
        }
        echo json_encode($result);
    }
}
