<?php
$dbhost =  getenv('PDCH');
$dbusername =  getenv('PDCU');
$password=  getenv('PDCP');
$database_name =  getenv('PDCD');
$connection = pg_connect("host=".$dbhost." user=".$dbusername." password=".$password." dbname=$database_name") or die ("Impossibile connettersi al server");
?>
