<?php
require('db.php');
$ana = $_POST['ana'];
$q = "
SELECT scheda.id, scheda.dgn_numsch, scheda.dgn_dnogg, cronologia.cro_spec, file.path
FROM scheda
INNER JOIN anagrafica ON scheda.ana_id = anagrafica.id 
INNER JOIN ricerca ON scheda.cmp_id = ricerca.id
INNER JOIN cronologia ON cronologia.id_scheda = scheda.id
LEFT JOIN file on file.id_scheda = scheda.id
WHERE ricerca.hub = 2 and anagrafica.id = $ana
ORDER BY dgn_numsch ASC;
";

$exec = pg_query($connection, $q);

while($r = pg_fetch_array($exec)){
 echo "<tr>";
 echo "<td>".$r['dgn_numsch']."</td>";
 echo "<td>".$r['dgn_dnogg']."</td>";
 echo "<td>".$r['cro_spec']."</td>";
 echo "<td>";
 if($r['path']){
  echo "<a href='#' class='imgLink' data-src='".$r['path']."' data-id='".$r['id']."'><i class='fa fa-picture-o'></i></a>
        <div class='imgContent' id='imgContent".$r['id']."'>
         <div class='chiudiThumb'><i class='fa fa-times'></i></div>
        </div>";
 }
 echo "</td>";
 echo "<td><a href='#' class='viewScheda' data-id='".$r['id']."' title='Visualizza scheda monografica record'><i class='fa fa-external-link-square'></i></a></td>";
 echo "</tr>";
}


?>
