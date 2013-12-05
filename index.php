<?php
session_cache_limiter(false);
session_start();

require_once __DIR__.'/protected/NotORM.php';
require_once __DIR__.'/vendor/autoload.php';
$handle = fopen('x.txt', "a");
define('STDERR', $handle);

$c = new \hb\TransactionController();

$app = new \Slim\Slim(array(
    
));

header("Content-Type: application/json");
$app->group('/api', function () use ($app) {
    $app->group('/transaction', function () use ($app) {
        $ctrl = new \hb\TransactionController();
        $app->get('/:id', array ($ctrl, 'get'))->conditions(array('id' => '\d+'));
        $app->get('/statistic', array ($ctrl, 'statistic'));
        $app->get('/balance', array ($ctrl, 'balance'));
        $app->get('/importSparkasse', array ($ctrl, 'importSparkasse'));
        $app->get('/importGoogledrive', array ($ctrl, 'importGoogledrive'));
        $app->get('/', array ($ctrl, 'index'));
        
        $app->post('/import', array ($ctrl, 'import'));        
        
        $app->post('/', array ($ctrl, 'save'));
        $app->put('/:id', array ($ctrl, 'update'));
        $app->delete('/:id', array ($ctrl, 'delete'));
        
        
    });
    
    $app->group('/account', function () use ($app) {
        $accountCtrl = new \hb\AccountController();
        $app->get('/', array ($accountCtrl, 'index'));
    });
    
    $app->group('/category', function () use ($app) {
        $ctrl = new \hb\CategoryController();
        $app->get('/:id', array ($ctrl, 'get'))->conditions(array('id' => '\d+'));
        $app->get('/', array ($ctrl, 'index'));
    });
});

$app->get('/account/form', function() use ($app) {
    $accounts = $db->account();
    $a = array();
    foreach ($accounts as $account) {
        $a[] = array('name' => $account['name']);
    }
    $app->flash('accounts', $a);
    $app->render('account_form.php');
});

$app->post('/account/save', function() use ($app){
    $req = $app->request();
    $account = array('name' => $req->params('name'));
    $db->account()->insert($account);
    $app->redirect('form');
});

$app->get('/operation/form', function() use ($app){
    $app->render('operation_form.php');
});

$app->post('/operation/save', function() use ($app){
    $req = $app->request();
    $errors = array();
    $params = array(
        'email' => array(
            'name'=>'Email',
            'required'=>true,
            'max_length'=>64,
        ),
        'subject' => array(
            'name'=>'Subject',
            'required'=>true,
            'max_length'=>256,
        ),
        'message' => array(
            'name'=>'Message',
            'required'=>true,
            'max_length'=>512,
        ),
    );
    foreach($params as $param=>$options){
        $value = $req->params($param);
        if($options['required']){
            if(!$value){
                $errors[] = $options['name'].' is required!';
            }
        }
        if($value and strlen($value) > $options['max_length']){
            $errors[] = $options['name'].' must be less than '.$options['max_length'].' characters long!';
        }
    }
    if($errors){
        $app->flash('errors',$errors);
    }
    else{
        //submit_to_db($email, $subject, $message);
        $app->flash('message','Form submitted!');
    }
    $app->redirect('form');
});

$app->get('/hello/:name', function ($name) {
    echo "Hello, $name";
});

$app->run();

fclose($handle);