<?php
session_start();
require("inc/db.php");
$t = $_POST['t'];
if(is_array($t)){ $tipi = $t;}else{ $tipi = explode(",",$t);}

$comune = $_POST['com'];
$localita = $_POST['loc'];
$indirizzo = $_POST['ind'];
$vector = $_POST['fts'];
$ci = $_POST['ci'];
$cf = $_POST['cf'];

$com = ($comune == 0)?'c.id > 0':'c.id='.$comune;
$loc = ($localita == 0)?'l.id > 0':'l.id='.$localita;
$ind = ($indirizzo == 0)?'i.id > 0':'i.id='.$indirizzo;
$fts = ($vector == 'no')?"":"where fts.v @@ to_tsquery('".$vector."')";


$coalesce='';
if($tipi[0] != 0){
 foreach($tipi as $t){
  switch($t) {
   case 7: $coalesce .= "coalesce(foto2.foto2_vector,'') || "; break;
   case 10: $test .= 'cartografiche '; break; 
  }
 }
 $tipo = "s.dgn_tpsch = " . implode(" OR s.dgn_tpsch = ", $tipi);
}else{
 $tipo = "s.dgn_tpsch > 0";
}

$query = "
with 
 tipo as (select s.id, s.dgn_numsch, s.dgn_dnogg
          from scheda s, ricerca r 
          where s.cmp_id = r.id and r.hub = 2 and s.fine = 2 and ($tipo))
,area as (select t.id, t.dgn_numsch, t.dgn_dnogg
          from tipo t
          left join aree_scheda a on a.id_scheda = t.id
          left join aree on a.id_area = aree.id
          left join comune c on aree.id_comune = c.id
          left join localita l on aree.id_localita = l.id
          left join indirizzo i on aree.id_indirizzo = i.id
          where $com and $loc and $ind)
,crono as (select a.id, a.dgn_numsch, a.dgn_dnogg, c.cro_spec
           from area a, cronologia c 
           where a.id = c.id_scheda and ((c.cro_iniz between $ci and $cf) or (c.cro_fin between $ci and $cf)))
, fts as (select c.id
        , c.cro_spec
        , c.dgn_numsch
        , c.dgn_dnogg
        , coalesce(foto1.foto1_vector,'')||coalesce(foto2.foto2_vector,'')||coalesce(scheda.scheda_vector) as v 
          from crono c 
          left join scheda on scheda.id = c.id
          left join foto on foto.id_scheda = c.id
          left join foto1 on foto1.dgn_numsch1 = foto.dgn_numsch
          left join foto2 on foto2.dgn_numsch2 = foto.dgn_numsch
          left join biblio on biblio.id_scheda = c.id
          left join biblio1 on biblio1.dgn_numsch1 = biblio.dgn_numsch
          left join biblio2 on biblio2.dgn_numsch2 = biblio.dgn_numsch
          left join cartografia on cartografia.id_scheda = c.id
          left join cartografia2 on cartografia2.dgn_numsch2 = cartografia.dgn_numsch
          left join fonti_orali on fonti_orali.id_scheda = c.id
          left join fonti_orali1 on fonti_orali1.dgn_numsch1 = fonti_orali.dgn_numsch
          left join fonti_orali2 on fonti_orali2.dgn_numsch2 = fonti_orali.dgn_numsch
          left join fonti_orali3 on fonti_orali3.dgn_numsch3 = fonti_orali.dgn_numsch
         )
select distinct fts.id, fts.cro_spec, fts.dgn_numsch, fts.dgn_dnogg, file.path 
from fts
left join file on file.id_scheda = fts.id
$fts
order by dgn_numsch asc;
";

$e = pg_query($connection, $query);
$row = pg_num_rows($e);

?>
  <?php 
   if($row == 0){
    echo "<header>La ricerca non ha prodotto risultati</header>";
    echo "<div style='display:none'>".$query."</div>";
   }else{?>
 <input type="hidden" id="filtriStored" value="si" />
 <input type="hidden" id="tipoStored" value="<?php echo json_encode($t); ?>" />
 <input type="hidden" id="comStored" value="<?php echo $comune; ?>" />
 <input type="hidden" id="locStored" value="<?php echo $localita; ?>" />
 <input type="hidden" id="indStored" value="<?php echo $indirizzo; ?>" />
 <input type="hidden" id="ftsStored" value="<?php echo $vector; ?>" />
 <input type="hidden" id="ciStored" value="<?php echo $ci; ?>" />
 <input type="hidden" id="cfStored" value="<?php echo $cf; ?>" />
 <header>La ricerca ha restituito <?php echo $row; ?> record</header>
 <table class="zebra footable toggle-arrow" data-filter="#filtro" data-filter-text-only="true">
  <thead>
   <tr class='csv'>
    <th data-sort-initial="true">RECORD N.</th>
    <th data-hide="phone">DENOMINAZIONE OGGETTO</th>
    <th data-hide="phone">CRONOLOGIA</th>
    <th data-hide="phone"></th>
    <th data-hide="phone"></th>
   </tr>
  </thead>
  <tbody>
   <?php 
    while ($r = pg_fetch_array($e)) {
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
     echo "<td><a href='scheda_archeo.php?id=".$r['id']."&p=c'><i class='fa fa-external-link-square'></i></a></td>";
     echo "</tr>";
    }
   
    } 
   ?>
  </tbody>
  </table>

<script type="text/javascript">
 var stored = document.getElementById("filtriStored").value;
 var comStored = document.getElementById("comStored").value;
 var locStored = document.getElementById("locStored").value;
 var indStored = document.getElementById("indStored").value;
 var ftsStored = document.getElementById("ftsStored").value;
 var ciStored = document.getElementById("ciStored").value;
 var cfStored = document.getElementById("cfStored").value;
 var tipiStored= <?php echo json_encode($tipi); ?>;
 sessionStorage.setItem("stored",stored);
 sessionStorage.setItem("comStored",comStored);
 sessionStorage.setItem("locStored",locStored);
 sessionStorage.setItem("indStored",indStored);
 sessionStorage.setItem("ftsStored",ftsStored);
 sessionStorage.setItem("ciStored",ciStored);
 sessionStorage.setItem("cfStored",cfStored);
 sessionStorage.setItem("tipiStored",tipiStored);
</script>
