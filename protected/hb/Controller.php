<?php


namespace hb;

class Controller {
    /**
     * 
     * @return \NotORM
     */
    protected function getDb() {
        $pdo = new \PDO('mysql:dbname=homebank;host=localhost', 'root', '');
        $db = new \NotORM($pdo);
        $db->debug = true;        
        return $db;
    }
}