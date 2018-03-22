<?php
$dbhost = 'localhost';
$dbusername = 'pdc';
$password='pDcdBAdmiN';
$database_name = 'pdc';
$port = 5432;
$connection = pg_connect("host=$dbhost port=$port user=$dbusername password=$password dbname=$database_name") or die ("Impossibile connettersi al server");
?>
