<?php
$dbhost = 'localhost'; // Chalda here.
// $dbhost = '89.145.113.21';
// Nuovo ip: 91.212.182.189
$dbusername = 'lefontip';
$password='tgUaa711K3';
$database_name = 'lefontip_db';

$connection = pg_connect("host=$dbhost user=$dbusername password=$password dbname=$database_name") or die ("Impossibile connettersi al server");
?>
