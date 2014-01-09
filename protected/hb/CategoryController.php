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
    
    public function save() {
        $app = \Slim\Slim::getInstance();
        $message = json_decode($app->request->getBody());
        $data = array(
            'name' => $message->name,
            'symbol' => $message->symbol
        );
        $category = new \hb\model\Category();
        $category->save($data);
        echo json_encode(array('status' => 'ok'));
    }
    
    public function update() {
        $app = \Slim\Slim::getInstance();
        $message = json_decode($app->request->getBody());
        $data = array(
            'id' => $message->id,
            'symbol' => $message->symbol,
            'name' => $message->name
        );
        $category = new \hb\model\Category();
        $c = $category->save($data);
        echo json_encode($c);
    }
    
    public function delete($id) {
        $db = $this->getDb();
        $category = $db->category[$id];
        $category->delete();
        echo json_encode(array('status' => 'ok'));
    }
}
