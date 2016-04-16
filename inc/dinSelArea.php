<?php
require('db.php');
$com = $_GET["com"];
$array = array();
$a1 = array();
$a2 = array();
if($com == 0){
 $q1 = ("
  SELECT localita.id as idlocalita,localita.localita
  FROM aree, aree_scheda, scheda, ricerca, localita
  WHERE aree.id_localita = localita.id
    AND aree_scheda.id_area = aree.nome_area 
    AND aree_scheda.id_scheda = scheda.id 
    AND scheda.cmp_id = ricerca.id 
    AND ricerca.hub = 2
    AND (localita not like '-' AND localita.id <> 873)
  GROUP BY idlocalita, localita
  ORDER BY 2 ASC;
");

 $q2 = ("
  SELECT distinct i.id as idindirizzo, i.cap||' - '||i.indirizzo as indirizzo
  FROM aree, aree_scheda, scheda, ricerca, indirizzo i
  WHERE aree.id_indirizzo= i.id
    AND aree_scheda.id_area = aree.nome_area 
    AND aree_scheda.id_scheda = scheda.id
    AND scheda.cmp_id = ricerca.id
    AND ricerca.hub = 2
    AND cap <> 0
  ORDER BY 2 ASC;
");
}else{
 $q1 = ("
  SELECT DISTINCT l.id as idlocalita,l.localita
  FROM aree, aree_scheda, scheda, ricerca, comune c, localita l
  WHERE aree.id_localita = l.id
    AND l.comune = c.id
    AND aree_scheda.id_area = aree.nome_area 
    AND aree_scheda.id_scheda = scheda.id 
    AND scheda.cmp_id = ricerca.id 
    AND ricerca.hub = 2
    AND l.comune = $com
  ORDER BY 2 ASC;
 ");
 $q2 = ("
  SELECT DISTINCT i.id as idind, i.cap||' - '||i.indirizzo as indirizzo
  FROM aree, aree_scheda, scheda, ricerca, comune c, indirizzo i
  WHERE aree.id_indirizzo = i.id
    AND i.comune = c.id
    AND aree_scheda.id_area = aree.nome_area
    AND aree_scheda.id_scheda = scheda.id 
    AND scheda.cmp_id = ricerca.id 
    AND ricerca.hub = 2
    AND i.comune = 45
    AND i.cap <> 0
  ORDER BY 2 ASC;
 ");
}
$exec1=pg_query($connection, $q1);
while($loc = pg_fetch_assoc($exec1)){
  $locArr['idlocalita'] = $loc['idlocalita'];
  $locArr['localita'] = $loc['localita'];
  array_push($a1,$locArr);
}
$array['localita'] = $a1;

$exec2=pg_query($connection, $q2);
while($ind = pg_fetch_assoc($exec2)){
  $indArr['idind'] = $ind['idind'];
  $indArr['indirizzo'] = $ind['indirizzo'];
  array_push($a2,$indArr);
}
$array['indirizzi'] = $a2;


echo json_encode($array);
?>
