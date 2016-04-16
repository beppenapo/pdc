<?php
session_start();
require("inc/db.php");
$tipi = $_GET['t'];
$com = ($_GET['com'] == 0)?'c.id > 0':'c.id='.$_GET['com'];
$loc = ($_GET['loc'] == 0)?'l.id > 0':'l.id='.$_GET['loc'];
$ind = ($_GET['ind'] == 0)?'i.id > 0':'i.id='.$_GET['ind'];
$fts = ($_GET['fts'] == 'no')?"":"where fts.v @@ to_tsquery('".$_GET['fts']."')";
$ci = $_GET['ci'];
$cf = $_GET['cf'];

$coalesce='';
if($tipi != 0){
 $tipoArr = explode(",", $tipi);
 foreach($tipoArr as $t){
  switch($t) {
   case 7: $coalesce .= "coalesce(foto2.foto2_vector,'') || "; break;
   case 10: $test .= 'cartografiche '; break; 
  }
 }
 $tipo = str_replace(","," OR s.dgn_tpsch = ",$tipi);
 $tipo = "s.dgn_tpsch = ".$tipo;
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
, fts as (select c.id, c.cro_spec, c.dgn_numsch, c.dgn_dnogg, coalesce(foto1.foto1_vector,'')||coalesce(foto2.foto2_vector,'') as v 
          from crono c 
          left join foto on foto.id_scheda = c.id
          left join foto1 on foto1.dgn_numsch1 = foto.dgn_numsch
          left join foto2 on foto2.dgn_numsch2 = foto.dgn_numsch
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
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8" />
<meta name="generator" content="gedit" >
<meta name="author" content="Arc-Team" >
<meta name="robots" content="INDEX,FOLLOW" />
<meta name="copyright" content="&copy;2015 Comunità Alta Valsugana e Bersntol" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<link href="css/responsive.css" rel="stylesheet" media="screen" />

<title>Archivio iconografico dei paesaggi di Comunità</title>

<style>
 .imgContent{display:none;position:absolute;width:100px;height:100px;border:1px solid #000;}
</style>

</head>
<body>
<header id="head"><?php require_once('inc/head.php')?></header>
<section id="image">
 <label class="caption">L'altopiano di Pinè, G.B. Unterveger 1878</label>
</section>
 <section id="main">
  <?php 
   if($row == 0){
    echo "<header>La ricerca non ha prodotto risultati</header>";
   }else{?>
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
     echo "<td><a href='#' class='imgLink' data-src='".$r['path']."' data-id='".$r['id']."'><i class='fa fa-picture-o'></i></a><div class='imgContent' id='imgContent".$r['id']."'></div></td>";
     echo "<td><a href='scheda_archeo.php?id=".$r['id']."' target='_blank'><i class='fa fa-external-link-square'></i></a></td>";
     echo "</tr>";
    }
   
    } 
   ?>
  </tbody>
  </table>
 </section>
<footer><?php require_once("inc/footer.php"); ?></footer>

<script type="text/javascript" src="lib/jquery.js"></script>
<script type="text/javascript" src="script/func.js"></script>
<script type="text/javascript">
$(document).ready(function() {
 var c = new Image();
 c.onload = function(){ $("section#image").css({"background-image":"url('img/layout/indexBg.png')"});}
 c.src = "img/layout/indexBg.png";
 $(window).load(function() { 
  $('html, body').stop().animate({scrollTop: $("#main").offset().top-headH-200}, 800);
 });
 
 $('.imgLink').click(function(e){
  e.preventDefault();
  $(".imgContent").hide();
  var src = $(this).data('src');
  var id = $(this).data('id');
  var x = $(this).position().left;
  var y = $(this).position().top;
  $("#imgContent"+id).css({"top":y,"left":x - 150, "background-image":"url(../foto/"+src+")","background-size":"cover","background-repeat":"no-repeat"}).fadeIn('fast');
  
 });
});
</script>
</body>
</html>
