<?php
class Conn{
    public $dbhost;
    public $dbuser;
    public $dbpwd;
    public $dbname;
    public $dsn;
    public $conn;

    public function __construct(){}

    protected function connect(){
        $this->dbhost = getenv('PDCH');
        $this->dbuser = getenv('PDCU');
        $this->dbpwd = getenv('PDCP');
        $this->dbname = getenv('PDCD');
        $this->dsn = "pgsql:host=".$this->dbhost." user=".$this->dbuser." password=".$this->dbpwd." dbname=".$this->dbname;
        $this->conn = new PDO($this->dsn);
        $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    public function pdo(){if (!$this->conn){ $this->connect();} return $this->conn;}
    public function __destruct(){if ($this->conn){$this->conn = null;}}
}
?>
