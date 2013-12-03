<?php

namespace hb;

class TransactionController extends Controller {

    public static $INCOME = 1;
    public static $EXPENSE = 2;
    public static $TRANSFER = 3;

    public function get($id) {
        $db = $this->getDb();
        $transaction = $db->transaction[$id];
        $result = array();

        $result[] = array(
            'id' => $transaction['id'],
            'account' => $transaction->account['name'],
            'account_to' => $transaction->account_to['name'],
            'date' => $transaction['date'],
            'category' => $transaction->category['name'],
            'type' => $transaction->type['name'],
            'comment' => $transaction['comment'],
            'amount' => $transaction['amount']
        );

        echo json_encode(array($result));
    }

    public function index() {
        $app = \Slim\Slim::getInstance();
        $req = $app->request();
        $itemPerPage = 10;
        $limit = $req->params('limit') ? $req->params('limit') : $itemPerPage;
        $page = $req->params('page') ? $req->params('page') - 1 : 0;

        $db = $this->getDb();
        $result = new \stdClass();
        $totalItems = $db->transaction()->count('*');
        $result->totalItems = $totalItems;
        $transactions = $db->transaction()
                ->order('date')
                ->limit($limit, $page * $limit);
        
        foreach ($transactions as $transaction) {
            $result->items[] = array(
                'id' => $transaction['id'],
                'account' => $transaction->account['name'],
                'account_to' => $transaction->account_to['name'],
                'date' => \hb\util\DateUtil::formatGerman($transaction['date']),
                'category' => array(
                    'id' => $transaction->category['id'],
                    'name' => $transaction->category['name'],
                    'symbol' => $transaction->category['symbol']),
                'type' => $transaction->type['name'],
                'comment' => $transaction['comment'],
                'amount' => $transaction['amount']
            );
        }
        echo json_encode($result);
    }

    public function save() {
        $app = \Slim\Slim::getInstance();
        $message = json_decode($app->request->getBody());
        $data = array(
            'account_id' => $message->account->id,
            'date' => $message->date,
            'category_id' => $message->category->id,
            'type_id' => 1, //$message->type->id,
            'comment' => isset($message->comment) ? $message->comment : '',
            'amount' => $message->amount
        );
        $transaction = new \hb\model\Transaction();
        $transaction->save($data);
        echo json_encode(array('status' => 'ok'));
    }

    public function update() {
        $app = \Slim\Slim::getInstance();
        $message = json_decode($app->request->getBody());
        $data = array(
            'id' => $message->id,
            'account_id' => $message->account->id,
            'date' => $message->date,
            'category_id' => $message->category->id,
            'type_id' => 1, //$message->type->id,
            'comment' => isset($message->comment) ? $message->comment : '',
            'amount' => $message->amount
        );
        $transaction = new \hb\model\Transaction();
        $t = $transaction->save($data);
        echo json_encode($t);
    }

    public function delete($id) {
        $db = $this->getDb();
        $transaction = $db->transaction[$id];
        $transaction->delete();
        echo json_encode(array('status' => 'ok'));
    }

    public function importSparkasse() {
        $fileName = 'data/10.2013.sparkasse.csv';
        $db = $this->getDb();
        $row = 0;
        if (($handle = fopen($fileName, "r")) !== FALSE) {
            while (($csvData = fgetcsv($handle, 1000, ";")) !== FALSE) {
                $row++;
                if ($row == 1) {
                    continue;
                }
                $rawCategory = $csvData['5'];
                $categoryName = '';
                if (strstr($rawCategory, 'ELLER-MONTAN')
                        || strstr($rawCategory, 'TANKSTELLE')) {
                    $categoryName = 'Auto';
                }
                if (strstr($rawCategory, 'NETTO-EINFACH')
                        ||strstr($rawCategory, 'KAUFPARK')) {
                    $categoryName = 'Lebensmittel';
                }
                if (strstr($rawCategory, 'ELENA MAER')
                        ||strstr($rawCategory, 'STADTWERKE')) {
                    $categoryName = 'Haus';
                }
                if (strstr($rawCategory, 'O2')
                        ||strstr($rawCategory, 'UNITYMEDIA')) {
                    $categoryName = 'Telefon';
                }
                if (strstr($rawCategory, 'BITMARCK')) {
                    $categoryName = 'Gehalt';
                }
                
                $category = new \hb\model\Category();
                $cat = $category->get('name', $categoryName);
                if (!$cat['id']) {
                    $cat = $category->save(array('name' => $categoryName));
                }

                $categoryId = 1;
                if ($cat['id']) {
                    $categoryId = $cat['id'];
                }

                $app = \Slim\Slim::getInstance();

                $type = strpos('-', $csvData[8]) === false ? TransactionController::$INCOME : TransactionController::$EXPENSE;
                $data = array(
                    'account_id' => 1,
                    'date' => $csvData[2],
                    'category_id' => $categoryId,
                    'type_id' => $type,
                    'comment' => ucfirst(strtolower($csvData[5])),
                    'amount' => str_replace(',', '.', $csvData[8])
                );
                $transaction = new \hb\model\Transaction();
                $transaction->save($data);
            }
            fclose($handle);
        }
    }

    public function importGoogledrive() {
        $fileName = 'data/gd/02.2011.csv';
        $row = 0;
        $transaction = new \hb\model\Transaction();
        $handle = fopen($fileName, "r");
        while (($csvData = fgetcsv($handle, 1000, ",")) !== FALSE) {
            $row++;
            if ($row < 3 || $csvData[0] == '') {
                continue;
            }

            $category = new \hb\model\Category();

            $cat = $category->get('name', $csvData[1]);
            if (!$cat['id']) {
                $cat = $category->save(array('name' => $csvData[1]));
            }

            $type = strpos('-', $csvData[3]) === false ? TransactionController::$INCOME : TransactionController::$EXPENSE;
            $amount = str_replace('.', '', $csvData[3]);
            $amount = str_replace(',', '.', $amount);
            $data = array(
                'account_id' => 1,
                'date' => $csvData[0],
                'category_id' => $cat['id'],
                'type_id' => $type,
                'comment' => $csvData[2],
                'amount' => $amount
            );
            $transaction->save($data);
        }
        fclose($handle);
    }

    public function statistic() {
        $app = \Slim\Slim::getInstance();
        $req = $app->request();

        $db = $this->getDb();

        $startDate = $req->params('startdate') ? $req->params('startdate') : '01.01.1900';
        $endDate = $req->params('enddate') ? $req->params('enddate') : '31.12.9999';

        $start = util\DateUtil::formatMysql($startDate);
        $end = util\DateUtil::formatMysql($endDate);
        $transactions = $db->transaction()
                ->select('category_id, SUM(amount) amount')
                ->where('date > ? and date < ?', $start, $end)
                ->group('category_id');
        $result = array();
        foreach ($transactions as $transaction) {
            $result[] = array(
                'category' => $transaction->category['name'],
                'amount' => $transaction['amount']
            );
        }

        echo json_encode($result);
    }

    public function balance() {
        $db = $this->getDb();
        $transactions = $db->transaction()
                ->select('account_id, SUM(amount) amount')
                ->group('account_id');
        $result = new \stdClass();
        foreach ($transactions as $transaction) {
            $result->items[] = array(
                'account' => $transaction->account['name'],
                'amount' => $transaction['amount']
            );
        }

        echo json_encode($result);
    }
    
}
