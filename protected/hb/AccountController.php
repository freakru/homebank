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
}
