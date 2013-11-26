<?php

namespace hb\model;

abstract class Model {

    protected $db;

    public function __construct() {
        $this->db = $this->getDb();
    }

    protected function getDb() {

        $pdo = new \PDO('mysql:dbname=homebank;host=localhost', 'root', '');
        $db = new \NotORM($pdo);
        $db->debug = true;

        return $db;
    }

}
