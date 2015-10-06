<?php
setlocale(LC_ALL, 'ita', 'it_IT.utf8');
$data = strftime("%d %B %Y");
require("../inc/db.php");
$r = ("
SELECT scheda.id
FROM scheda, ricerca
WHERE scheda.cmp_id = ricerca.id and ricerca.hub=2;
");
$exec = pg_query($connection, $r);
$tot = pg_num_rows($exec);
?>
<div class="wrap headWrap">
 <div id="headLogo" class="headDiv"></div>
 <div id="headTitle" class="headDiv bianco"> 
  <h1>ARCHIVIO ICONOGRAFICO DEI PAESAGGI DI COMUNITÀ</h1>
  <h2>Comunità Alta Valsugana e Bersntol<br/>Tolgamoa'schòft Hoa Valzegu' ont Bersntol</h2>
 </div>
 <div id="headNav" class="headDiv"> 
  <div id="record" class="bianco">Ad oggi l'archivio contiene <?php echo $tot; ?> record</div>
  <nav class="headDiv">
   <ul>
    <li><a href="#" id="progetto" class="mainLink prevent" title="Vai alla pagina del progetto">PROGETTO</a></li>
    <li><a href="webgis.php" title="Vai alla pagina del webgis">WEBGIS</a></li>
    <li><a href="#" id="catalogo" class="mainLink prevent" title="Vai alla pagina del catalogo">CATALOGO</a></li>
    <li><a href="#" id="collezioni" class="mainLink prevent" title="Vai alla pagina delle collezioni">COLLEZIONI</a></li>
    <li><a href="#" id="contatti" class="mainLink prevent" title="Vai alla pagina dei contatti">CONTATTI</a></li>
    <li><a href="#" id="istruzioni" class="mainLink prevent" title="Vai alla pagina delle istruzioni">ISTRUZIONI</a></li>
    <li><a href="#" id="credits" class="mainLink prevent" title="Vai alla pagina dei credits">CREDITS</a></li>
   </ul>
  </nav>
 </div>
</div>

 <?php if (isset($_SESSION['id_user'])){require("inc/sessione.php"); }?>
