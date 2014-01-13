<?php

namespace hb;

class AccountController extends Controller {

    public function index() {
        $db = $this->getDb();
        $accounts = $db->account();
        $result = array();
        if ($accounts === null) {
            echo json_encode($result);
            return false;
        }
        foreach ($accounts as $account) {
            $result[] = array(
                'id' => $account['id'],
                'name' => $account['name']
            );
        }
        echo json_encode($result);
    }
    
    public function save() {
        $app = \Slim\Slim::getInstance();
        $message = json_decode($app->request->getBody());
        $data = array(
            'name' => $message->name
        );
        $account = new \hb\model\Account();
        $account->save($data);
        echo json_encode(array('status' => 'ok'));
    }
    
    public function update() {
        $app = \Slim\Slim::getInstance();
        $message = json_decode($app->request->getBody());
        $data = array(
            'id' => $message->id,
            'name' => $message->name
        );
        $account = new \hb\model\Account();
        $a = $account->save($data);
        echo json_encode($c);
    }
    
    public function delete($id) {
        $db = $this->getDb();
        $account = $db->account[$id];
        $account->delete();
        echo json_encode(array('status' => 'ok'));
    }
}
