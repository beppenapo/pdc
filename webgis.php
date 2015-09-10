<?php
session_start();
if (!isset($_SESSION['username'])){$_SESSION['username']='guest';}
if($_SESSION['hub']){
 $hub=$_SESSION['hub'];
}else{
 if($_GET['hub']){
  $hub=$_GET['hub'];
 }
}
?>

<!DOCTYPE html>
<html lang="it">
<head>
<?php require("inc/metatag.php"); ?>

  <title>Archivio iconografico dei Paesaggi di Comunità':'Le fonti per la storia. Per un archivio delle fonti sulle valli di Primiero e Vanoi</title>

<link rel="stylesheet" href="css/mappa.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/head.css" type="text/css" media="screen" />
<link rel="stylesheet" href="css/google.css" type="text/css">
<link rel="stylesheet" href="lib/OpenLayers-2.12/theme/default/style.css" type="text/css">
<link rel="stylesheet" href="../lib/jquery-ui-lampi/css/humanity/jquery-ui-1.8.18.custom.css" type="text/css" media="screen" />
<link rel="stylesheet" href="../css/jquery.qtip.min.css" type="text/css" />

</head>
 <body onload="init()"> 
  <header id="head"><?php require_once('inc/head.php')?></header>
  <div id="map"></div>
  <div id="pannello"></div> 
    <div id="drag" class="attivo"></div>
    <div id="zoomArea"></div>
    <div id="zoomMax"></div>
    <div id="history">
      <div id="btnPrev"></div>
      <div id="btnNext"></div>
    </div>
  <div id="nord"></div>
  
  <div id="text"> 
   <div id="switcher">
    <div id="cartografiaToggle"><h1 class="switcher">CARTOGRAFIA DI BASE</h1></div>
    <div id='cartografiaSwitch'>
     <div class="livelli">
      <input type="radio" name="baselayer" value="gsat" class='checkLiv' onclick="map.setBaseLayer(gsat)" checked /> SATELLITE
     </div>
     <div class="livelli">
      <input type="radio" name="baselayer" value="osm" class='checkLiv' onclick="map.setBaseLayer(osm)" />OPENSTREETMAP
     </div>
     <div class="livelli">
      <input type="checkbox" name="baselayer" id="comuni"class='checkLiv' value="comuni" checked/><label id="comuniLabel">COMUNI</label>
     </div>
     <div class="livelli">
      <input type="checkbox" name="baselayer" id="toponomastica"class='checkLiv' value="toponomastica" checked/><label id="toponomasticaLabel">TOPONOMASTICA</label>
     </div>
    </div><!--cartografiaSwitch-->
     
    <div id="areaToggle" class="hover tip" tip="Mostra/nascondi le aree di interesse"><h1 class="switcher">AREA DI INTERESSE</h1></div>
    <div id='areaSwitch' class="chiuso">
     <div class="livelli">
      <input type="checkbox" name="overlays" id="aree_biblio" value="aree_biblio" data-tipo="5" class='checkLiv ai' />
      <label for="aree_biblio" id="areeBiblioLabel"  class="info" tip="Il livello mostra le aree di interesse bibliografico...">EDITORIA</label>
      <div class="legende legendeAree legendeAreeBiblio"></div>
     </div>
     <div class="livelli">       
      <input type="checkbox" name="overlays" id="aree_foto" value="aree_foto" data-tipo="7" class='checkLiv ai' />
      <label for="aree_foto" id="areeFotoLabel"  class="info" tip="Il livello mostra le aree di interesse fotografico...">FOTOGRAFIA </label>
      <div class="legende legendeAree legendeAreeFoto"></div>
     </div>
     <div class="livelli">        
      <input type="checkbox" name="overlays" id="aree_orale" value="aree_orale" data-tipo="1" class='checkLiv ai' /> 
      <label for="aree_orale" id="areeOraleLabel" class="info" tip="Il livello mostra le aree di interesse per le fonti orali...">AUDIO/VIDEO</label>
      <div class="legende legendeAree legendeAreeOrale"></div>
     </div>
     <div class="livelli">        
      <input type="checkbox" name="overlays" id="aree_carto" value="aree_carto" data-tipo="10" class='checkLiv ai' /> 
      <label for="aree_carto" id="areeCartoLabel" class="info" tip="Il livello mostra le aree di interesse per le fonti cartografiche...">CARTOGRAFIA</label>
      <div class="legende legendeAree legendeAreeCarto"></div>
     </div>

     <div class="livelli bassa">
      <div class="sliderLivelli">
       <div class="sliderOpacity" id="sliderArea"> <div class="ui-slider-handle"></div> </div>
       <span class="amount" id="amountAree"></span>
      </div>
     </div>
    </div><!--areaSwitch-->
   </div><!--switcher-->
   <?php if($hub!=2){?>
   <div id="ricerca">     
    <div id="ricercaToggle"  class="tip" tip="Mostra/nascondi i form per la ricerca avanzata"><h1>RICERCA</h1></div>
    <div id="formRicerca" class="chiuso">
     <div class="sezioni" id="datiGenerali"><h2>DATI GENERALI</h2></div>
     <div class="sezioni" id="compilazione"><h2>COMPILAZIONE</h2></div>
     <div class="sezioni" id="provenienza"><h2>PROVENIENZA</h2></div>
     <div class="sezioni" id="cronologia"><h2>CRONOLOGIA</h2></div>
     <div class="sezioni" id="anagrafica"><h2>ANAGRAFICA</h2></div>
     <div class="sezioni" id="documentazione"><h2>DOCUMENTAZIONE</h2></div>
     <div class="sezioni" id="consultabilita"><h2>CONSULTABILITA'</h2></div>
     <div class="sezioni" id="conservazione"><h2>STATO DI CONSERVAZIONE</h2></div>
     <div class="sezioni" id="bibliografica"><h2>BIBLIOGRAFICA</h2></div>
     <div class="sezioni" id="fotografica"><h2>FOTOGRAFICA</h2></div>
     <div class="sezioni" id="orale"><h2>ORALE</h2></div>
    </div><!--div formRicerca --> 
   </div><!-- div ricerca --> 
   <?php } ?>
  </div><!--div text -->
  
 <!-- <div id="sliderWrap">
   <div id="sliderLabel"><label>Anno </label></div> 
   <div id="slider"></div>
  </div>-->
  <div id="scalebar"></div>
  <div id="coord"></div>
  

 <div id="resultWrap">
  <div id="result">
    <div id="resultHeader">
     <div id="resHeadImg" data-icon='&#10006;'>&#10006;</div>
    </div>
    <div id="resultContent"></div>
  </div>
 </div>
  <script type="text/javascript" src="../lib/jquery-ui-lampi/js/jquery-1.7.1.min.js"></script>
  <script type="text/javascript" src="../lib/jquery-ui-lampi/js/jquery-ui-1.8.18.custom.min.js"></script>
  <script type="text/javascript" src="lib/OpenLayers-2.12/OpenLayers.js"></script>
  <script type="text/javascript" src="../lib/OpenLayers-2.10/ScaleBar.js"></script>
  <script src="http://maps.google.com/maps/api/js?v=3.2&amp;sensor=false"></script>
  <script type="text/javascript" src="../lib/jquery.qtip.min-2.0.1.js"></script>
  <script src="script/webgis.js"></script>
  <script type="text/javascript">
  var hub = '<?php echo($hub); ?>';
  console.log('hub: '+hub);
   
 </script>
    </body> 
</html> 
