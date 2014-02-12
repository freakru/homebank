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
    
    /**
     * transactions list for given month and account
     * account == 0 - for all tranactions
     */
    public function index() {
        $app = \Slim\Slim::getInstance();
        $req = $app->request();
        
        $account = $req->params('account') ? (int)$req->params('account') : 0;
        $conditionAccount = '';
        if ($account !== 0) {
            $conditionAccount = ' and account_id = ' . $account;
        }
        $firstDay = $req->params('month') ? $req->params('month') : date('m');
        $lastDay = util\DateUtil::calcLastDateOfMonth($firstDay);
        $firstDay = util\DateUtil::formatMysql($firstDay);
        $lastDay = util\DateUtil::formatMysql($lastDay);
        
        $db = $this->getDb();
        $result = new \stdClass();
        $totalItems = $db->transaction()->count('*');
        $result->totalItems = $totalItems;
        $startMonth = $db->transaction()
                ->select('account_id, SUM(amount) amount')
                ->where('date < ?' . $conditionAccount, $firstDay)
                ->group('account_id');
        
        $endMonth = $db->transaction()
                ->select('account_id, SUM(amount) amount')
                ->where('date <= ?' . $conditionAccount, $lastDay)
                ->group('account_id');
        
        $transactions = $db->transaction()
                ->order('date')
                ->where('date >= ? and date <= ?' . $conditionAccount, $firstDay, $lastDay);

        
        foreach ($startMonth as $start) {
            $result->start = $start['amount'];
        }
        foreach ($endMonth as $end) {
            $result->end = $end['amount'];
        }
        
        $diff = $result->start;
        foreach ($transactions as $transaction) {
            $loan = array();
            if ($transaction->category['id'] == CATEGORY_LOAN) {
                $loan = $this->calculateLoan($transaction['comment'], $lastDay);
            }
            $diff +=  + $transaction['amount'];
            
            // get transfer acoount
            $accountTo = null;
            if ($transaction['account_to_id']) {
                $account = $db->account[$transaction['account_to_id']];
                $accountTo = array('id' => $account['id'],
                    'name' => $account['name']);
                //var_dump($account->account_to_id);
            }
            $result->items[] = array(
                'id' => $transaction['id'],
                'account' => $transaction->account['name'],
                'account_to' => $accountTo,
                'date' => \hb\util\DateUtil::formatGerman($transaction['date']),
                'category' => array(
                    'id' => $transaction->category['id'],
                    'name' => $transaction->category['name'],
                    'symbol' => $transaction->category['symbol']),
                'type' => $transaction->type['name'],
                'comment' => $transaction['comment'],
                'loan' => $loan,
                'amount' => $transaction['amount'],
                'diff' => $diff
            );
            
        }
        echo json_encode($result);
    }
    
    private function calculateLoan($comment, $lastDay) {
        $db = $this->getDb();
        $loan = $db->loan('name = ?', $comment)->fetch();
        $payment = $db->transaction()
                ->select('COUNT(*) count, SUM(amount) amount')
                ->where('category_id = ? AND comment = ? and date <= ?', CATEGORY_LOAN, $comment, $lastDay)
                ->fetch();
        $balance = $loan['amount'] + $payment['amount'];
        $rate = round(($loan['amount'] - $balance) / $payment['count'], 2);
        $countMonth = intval($loan['amount'] / $rate);
        $startDate = strtotime($loan['date']);
        $endDate = date('d.m.Y', strtotime(date("Y-m-d", $startDate) . '+'.$countMonth.' month'));
        
        return array(
            'date' => $endDate,
            'balance' => $loan['amount'] + $payment['amount']                
        );
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

    public function importSparkasse($fileName) {
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
                if (strstr($rawCategory, 'ELLER-MONTAN') || strstr($rawCategory, 'TANKSTELLE')) {
                    $categoryName = 'Auto';
                }
                if (strstr($rawCategory, 'NETTO-EINFACH') || strstr($rawCategory, 'KAUFPARK')) {
                    $categoryName = 'Lebensmittel';
                }
                if (strstr($rawCategory, 'ELENA MAER') || strstr($rawCategory, 'STADTWERKE')) {
                    $categoryName = 'Haus';
                }
                if (strstr($rawCategory, 'O2') || strstr($rawCategory, 'UNITYMEDIA')) {
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

    public function importGoogledrive($fileName) {
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

    public function import() {
        $file = $_FILES['file'];

        if ($file['error'] === 0) {
            $name = uniqid('import' . date('Ymd') . '-').'.csv';
            if (move_uploaded_file($file['tmp_name'], 'data/' . $name) === true) {
                $this->importSparkasse('data/' . $name);
                //$this->importGoogledrive('data/' . $name);
            }
        }
        //$fileName = 'data/gd/02.2011.csv';
        echo 'ok';
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
        $result = new \stdClass();
        foreach ($transactions as $transaction) {
            if ($transaction['amount'] > 0) {
                continue;
            }
            $result->items[] = array(
                'category' => $transaction->category['name'],
                'amount' => -$transaction['amount']
            );
        }

        echo json_encode($result);
    }

    public function balance() {
        $db = $this->getDb();        
        $transactions = $db->transaction()
                ->select('account_id, SUM(amount) amount')
                ->group('account_id');
        $accounts = array();
        foreach ($transactions as $transaction) {
            $accounts[$transaction->account['name']] = $transaction['amount'];
        }
        
        // transfer sum
        $transfers = $db->transaction()
                ->select('account_to_id, SUM(amount) amount')
                ->where('account_to_id IS NOT NULL')
                ->group('account_to_id');
        foreach ($transfers as $transfer) {
            $account = $db->account('id = ?', $transfer['account_to_id'])->fetch();
            $accountName = $account['name'];
            $amount = -$transfer['amount'];
            
            if (array_key_exists($accountName, $accounts)) {
                $amount += $accounts[$accountName];
            }
            $accounts[$accountName] = $amount;
        }
        
        $result = new \stdClass();
        foreach ($accounts as $accountName => $amount) {
            $result->items[] = array(
                'account' => $accountName,
                'amount' => $amount
            );
        }        
        
        // calculate sum of all loans
        $loanSum = 0;
        $lastDay = util\DateUtil::formatMysql('31.12.9999');
        $loans = $db->loan();
        foreach ($loans as $loan) {
            $loanCalculation = $this->calculateLoan($loan['name'], $lastDay);
            $loanSum += $loanCalculation['balance'];
        }
        $result->items[] = array(
            'account' => 'Kredite',
            'amount' => -$loanSum
        );

        echo json_encode($result);
    }

}
