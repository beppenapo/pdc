<?php
session_start();
require("inc/db.php");
if (!isset($_SESSION['id_user'])){$_SESSION['id_user']=0;}
if($_SESSION['hub']){$hub=$_SESSION['hub'];}else{ if($_GET['hub']){ $hub=$_GET['hub']; }}
////  LISTA TOPONIMI PER FUNZIONE ZOOM ////////
$topoQ="select t.gid, upper(top_nomai) toponimo, upper(comu2) comune, st_X(st_transform((t.geom),3857))||','||st_Y(st_transform((t.geom),3857)) as lonlat from toponomastica t, comuni_bassa c where st_contains(c.geom, st_transform(t.geom,3857)) order by 3,2;";
$topoR=pg_query($connection,$topoQ);
$opt="<option value='0'>--zoom su località--</option>";
while($topo = pg_fetch_array($topoR)){ $opt.="<option value='".$topo['lonlat']."'>".$topo['comune']." - ".$topo['toponimo']."</option>";}
?>

<!DOCTYPE html>
<html lang="it">
    <head>
        <?php require("inc/metatag.php"); ?>
        <link rel="stylesheet" href="css/mappa.css" type="text/css" media="screen" />
        <link rel="stylesheet" href="lib/OpenLayers-2.12/theme/default/style.css" type="text/css">
        <link rel="stylesheet" href="css/jquery.qtip.min.css" type="text/css" />
        <style>
            h1.switcher{margin-top:20px;}
            h1.primo{margin-top:0px;}
        </style>
    </head>
    <body onload="init()">
        <header id="head"><?php require_once('inc/head.php'); ?></header>
        <div id="map"></div>
        <div id="pannello">
        </div>
        <div id="drag" class="attivo"></div>
        <div id="zoomArea"></div>
        <div id="zoomMax"></div>
        <div id="history">
            <div id="btnPrev"></div>
            <div id="btnNext"></div>
        </div>
        <div id="nord"></div>
        <div id="topoSearch"> <select> <?php echo $opt; ?> </select> </div>
        <div id="text">
            <div id="switcher">
                <div id="cartografiaToggle"><h1 class="switcher primo">CARTOGRAFIA DI BASE</h1></div>
                <div id='cartografiaSwitch'>
                    <div class="livelli">
                        <input type="radio" name="baselayer" id="gsat" value="gsat" class='checkLiv' onclick="map.setBaseLayer(gsat)" checked />
                        <label for="gsat">SATELLITE</label>
                    </div>
                    <div class="livelli">
                        <input type="radio" name="baselayer" id="osm" value="osm" class='checkLiv' onclick="map.setBaseLayer(osm)" />
                        <label for="osm">OPENSTREETMAP</label>
                    </div>
                    <div class="livelli">
                        <input type="checkbox" name="baselayer" id="comuni"class='checkLiv' value="comuni" checked/>
                        <label for="comuni" id="comuniLabel">COMUNI</label>
                    </div>
                    <div class="livelli">
                        <input type="checkbox" name="baselayer" id="toponomastica"class='checkLiv' value="toponomastica" checked/>
                        <label for="toponomastica" id="toponomasticaLabel">TOPONOMASTICA</label>
                    </div>
                </div><!--cartografiaSwitch-->

                <div>
                    <h1 class="switcher" style="cursor:pointer;" title="il layer è in fase di implementazione">CARTOGRAFIA STORICA <i class="fa fa-info-circle"></i></h1>
                </div>
                <div>
                    <div class="livelli">
                        <input type="checkbox" name="baselayer" id="catasto1859"class='checkLiv' value="catasto1859" />
                        <label for="catasto1859">CATASTO 1859</label>
                    </div>
                    <div class="livelli">
                        <input type="checkbox" name="baselayer" id="catasto1980"class='checkLiv' value="catasto1980" />
                        <label for="catasto1980">PGTIS 1983</label>
                    </div>
                </div>

                <div><h1 class="switcher">FILTRA PROGETTI</h1></div>
                <div>
                    <div class="livelli">
                        <input type="radio" name="projectLayer" id="projAll"class='checkLiv' value="63" checked />
                        <label for="projAll" title="Archivio inconografico dei paesaggi di comunità">ARCHIVIO COMPLETO <i class="fa fa-info-circle"></i></label>
                    </div>
                    <div class="livelli">
                        <input type="radio" name="projectLayer" id="miniere"class='checkLiv' value="70" />
                        <label for="miniere" title="Quando andavamo in miniera">MINIERE <i class="fa fa-info-circle"></i></label>
                    </div>
                </div>

                <div id="areaToggle" class="hover tip" tip="Mostra/nascondi le aree di interesse"><h1 class="switcher">AREA DI INTERESSE</h1></div>
                <div id='areaSwitch' class="chiuso">
                    <div class="livelli">
                        <input type="checkbox" name="overlays" id="aree_foto" value="aree_foto" data-tipo="7" class='checkLiv ai' />
                        <label for="aree_foto" id="areeFotoLabel"  class="info" tip="Il livello mostra le aree di interesse fotografico...">FOTOGRAFIA </label>
                        <div class="legende legendeAree legendeAreeFoto"></div>
                    </div>
                    <div class="livelli">
                        <input type="checkbox" name="overlays" id="aree_carto" value="aree_carto" data-tipo="10" class='checkLiv ai' />
                        <label for="aree_carto" id="areeCartoLabel" class="info" tip="Il livello mostra le aree di interesse per le fonti cartografiche...">CARTOGRAFIA</label>
                        <div class="legende legendeAree legendeAreeCarto"></div>
                    </div>
                    <div class="livelli">
                        <input type="checkbox" name="overlays" id="aree_orale" value="aree_orale" data-tipo="1" class='checkLiv ai' />
                        <label for="aree_orale" id="areeOraleLabel" class="info" tip="Il livello mostra le aree di interesse per le fonti orali...">AUDIO/VIDEO</label>
                        <div class="legende legendeAree legendeAreeOrale"></div>
                    </div>
                    <div class="livelli">
                        <input type="checkbox" name="overlays" id="aree_biblio" value="aree_biblio" data-tipo="5" class='checkLiv ai' />
                        <label for="aree_biblio" id="areeBiblioLabel"  class="info" tip="Il livello mostra le aree di interesse bibliografico...">PUBBLICAZIONI</label>
                        <div class="legende legendeAree legendeAreeBiblio"></div>
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
                <!--<div id="ricerca">
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
                </div>
                </div>-->
            <?php } ?>
        </div>
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
        <script type="text/javascript" src="lib/jquery-ui-lampi/js/jquery-1.7.1.min.js"></script>
        <script type="text/javascript" src="lib/jquery-ui-lampi/js/jquery-ui-1.8.18.custom.min.js"></script>
        <script type="text/javascript" src="lib/OpenLayers-2.12/OpenLayers.js"></script>
        <script type="text/javascript" src="lib/OpenLayers-2.12/ScaleBar.js"></script>
        <script src="https://www.openstreetmap.org/openlayers/OpenStreetMap.js"></script>
        <!-- <script src="https://maps.googleapis.com/maps/api/js?v=3&amp;key=AIzaSyDMFkI5sKTgbqn4cHBbI7BbDNCbhXEhLkk" type="text/javascript"></script> -->
        <script type="text/javascript" src="lib/jquery.qtip.min-2.0.1.js"></script>
        <script src="script/varMappa.js"></script>
        <script src="script/webgis.js"></script>
        <script type="text/javascript">
            u = <?php echo $_SESSION["id_user"]; ?>;
            cql = "hub=2 AND (progetto = 63 or progetto = 70)";
        </script>
    </body>
</html>
