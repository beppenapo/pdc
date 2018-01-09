<?php
session_start();
require("../inc/db.php");
if (isset($_GET['site'])) {
    if (!preg_match("/^(http|https):/", $_GET['site'])) { $_GET['site'] = 'http://'.$_GET['site']; }
    $go = $_GET['site'];
    header('Location: '.$go);
}

?>
<!DOCTYPE html>
<html lang="it">
    <head>
        <?php require("inc/metatag.php"); ?>
        <style>
            section#image{
            background-image:url('../img/icone/loader.gif');
            background-repeat: no-repeat;
            background-position:center center; }
            .labelCheck {display: inline-block; background-color: rgb(230,230,230); color: rgb(136,136,136); border: 1px solid rgb(136,136,136); font-size: 0.8em; padding: 0.3% 1%;}
            input[name='tipoProg']{ width: auto; margin: 2px;}
        </style>
    </head>
    <body>
        <?php require("inc/cookieBanner.php"); ?>
        <?php require("inc/licenze.php"); ?>
        <header id="head"><?php require_once('inc/head.php'); ?></header>
        <div id="mainContent">
            <section id="image"><label class="caption"></label></section>
            <section id="main"></section>
            <footer><?php require_once("inc/footer.php"); ?></footer>
        </div>
        <script type="text/javascript" src="lib/jquery.js"></script>
        <script type="text/javascript" src="lib/jquery-ui-1.10.4.custom.min.js"></script>
        <script type="text/javascript" src="lib/FooTable/js/footable.js"></script>
        <script type="text/javascript" src="lib/FooTable/js/footable.sort.js"></script>
        <!--<script type="text/javascript" src="lib/FooTable/js/footable.paginate.js"></script>-->
        <script type="text/javascript" src="lib/FooTable/js/footable.filter.js"></script>
        <script type="text/javascript" src="script/func_test.js"></script>
        <script type="text/javascript">
            var idUsr = "<?php echo($_SESSION['id_user']); ?>";
            var tipoUsr = "<?php echo($_SESSION['tipo']); ?>";
            var hub = "<?php echo($_SESSION['hub']); ?>";
            var div = "<?php echo($_POST['div']); ?>";
            var r = "<?php echo($_GET['r']); ?>";
            var s = "<?php echo($_GET['s']); ?>";
            if(r){
                var comStored = sessionStorage.getItem("comStored");
                var locStored = sessionStorage.getItem("locStored");
                var indStored = sessionStorage.getItem("indStored");
                var ftsStored = sessionStorage.getItem("ftsStored");
                var ciStored = sessionStorage.getItem("ciStored");
                var cfStored = sessionStorage.getItem("cfStored");
                var tipiStored = sessionStorage.getItem("tipiStored");
                cerca(tipiStored,comStored,locStored,indStored,ftsStored,ciStored,cfStored);
            }
            $(document).ready(function() {
                var section = $("section#image");
                var label = $('.caption');
                var backgrounds = new Array();
                backgrounds.push({img:'img/layout/07.jpg',cap:'Lago di Serraia, Baselga di Pinè (2000) - Biblioteca Comunale di Baselga di Pinè'});
                backgrounds.push({img:'img/layout/06.jpg',cap:'Chiesa pievana, Calceranica al Lago (1890-1910) - Collezione SAT Sezione di Caldonazzo'});
                backgrounds.push({img:'img/layout/02.jpg',cap:'Lago di Erdemolo, Palù del Fersina (2000-2015) - Collezione privata'});
                backgrounds.push({img:'img/layout/09.jpg',cap:'Località Tonezzeri, Centa San Nicolò (1979-1980) - Archivio Servizio Urbanistica Comunità Alta Valsugana e Bersntol'});
                backgrounds.push({img:'img/layout/08.jpg',cap:'Levico Terme (1950) - Biblioteca Comunale di Levico Terme'});
                backgrounds.push({img:'img/layout/05.jpg',cap:'Comunità Alta Valsugana e Bersntol (2000-2015) - Collezione privata'});
                backgrounds.push({img:'img/layout/01.jpg',cap:'Chiesa di Santa Zita, Levico Terme (2000-2015) - Collezione privata'});
                backgrounds.push({img:'img/layout/03.jpg',cap:'Castel Pergine, Pergine Valsugana (2000-2015) - Collezione privata'});
                var current = 0;
                function nextBackground() {
                    var pesca = backgrounds[current = ++current % backgrounds.length];
                    section.css({'background': 'url('+pesca.img+')', "background-size":"cover"});
                    label.text(pesca.cap);
                    setTimeout(nextBackground, 60000);//parte il loop
                }
                section.css({'background': 'url('+backgrounds[0].img+')', "background-size":"cover"});
                label.text(backgrounds[0].cap);
                setTimeout(nextBackground, 60000);//fa scattare il primo cambio background
            });
        </script>
    </body>
</html>
