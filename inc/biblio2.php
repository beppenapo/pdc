<?php
$nd = 'Dato non presente';
$qbiblio2 = ("
SELECT 
  s.id AS id_scheda, 
  b.id_biblio2,
  b.bib_titolo as titolo, 
  b.bib_sogg as soggetto, 
  b.bib_nome as autore, 
  b.bib_notenome as notenome, 
  b.bib_contenuto as contenuto, 
  b.bib_livbib as livbib_id, 
  l.definizione as livbib,
  b.bib_tipodoc as tipo, 
  b.bib_ediz as edizione, 
  b.bib_period as periodi, 
  b.bib_descfis as descrizione, 
  b.bib_lingua as lingua, 
  b.bib_notestor as note,
  b.sog_titolo,
  b.sog_sogg,
  b.sog_autore,
  b.sog_note,
  b.dtc_mattec,
  b.dtc_icol,
  b.dtc_misst,
  b.dtc_presneg,
  b.dtc_ffile,
  b.dtc_misfd,
  b.dtc_note,
  b.fot_collocazione
FROM  
  biblio2 b, 
  scheda s,
  lista_bib_livbib l
WHERE 
  b.id_scheda = s.id AND
  b.bib_livbib = l.id and
  s.id = $id;
");
$rq2 = pg_query($connection, $qbiblio2);
$aq2 = pg_fetch_array($rq2, 0, PGSQL_ASSOC);
$rowqbiblio2 = pg_num_rows($rq2);

$id_biblio2=$aq2['id_biblio2'];
$titolo= stripslashes($aq2['titolo']); if($titolo == '') {$titolo=$nd;}
$soggetto= stripslashes($aq2['soggetto']); if($soggetto == '') {$soggetto=$nd;}
$autore= stripslashes($aq2['autore']); if($autore == '') {$autore=$nd;}
$notenome= stripslashes($aq2['notenome']); if($notenome == '') {$notenome=$nd;}
$contenuto= stripslashes($aq2['contenuto']); if($contenuto == '') {$contenuto=$nd;}
$livbib= stripslashes($aq2['livbib']);
$livbib_id = $aq2['livbib_id'];
$tipo= stripslashes($aq2['tipo']); if($tipo == '') {$tipo=$nd;}
$edizione= stripslashes($aq2['edizione']); if($edizione == '') {$edizione=$nd;}
$periodi= stripslashes($aq2['periodi']); if($periodi == '') {$periodi=$nd;}
$descrizione= stripslashes($aq2['descrizione']); if($descrizione == '') {$descrizione=$nd;}
$lingua= stripslashes($aq2['lingua']); if($lingua == '') {$lingua=$nd;}
$note= stripslashes($aq2['note']); if($note == '') {$note=$nd;}

$sog_titolo= stripslashes($aq2['sog_titolo']); if($sog_titolo == '') {$sog_titolo=$nd;}
$sog_sogg= stripslashes($aq2['sog_sogg']); if($sog_sogg == '') {$sog_sogg=$nd;}
$sog_autore= stripslashes($aq2['sog_autore']); if($sog_autore == '') {$sog_autore=$nd;}
$sog_note= stripslashes($aq2['sog_note']); if($sog_note == '') {$sog_note=$nd;}
$dtc_mattec= stripslashes($aq2['dtc_mattec']); if($dtc_mattec == '') {$dtc_mattec=$nd;}
$dtc_icol= stripslashes($aq2['dtc_icol']); if($dtc_icol == '') {$dtc_icol=$nd;}
$dtc_misst= stripslashes($aq2['dtc_misst']); if($dtc_misst == '') {$dtc_misst=$nd;}
$dtc_presneg= stripslashes($aq2['dtc_presneg']); if($dtc_presneg == '') {$dtc_presneg=$nd;}
$dtc_ffile= stripslashes($aq2['dtc_ffile']); if($dtc_ffile == '') {$dtc_ffile=$nd;}
$dtc_misfd= stripslashes($aq2['dtc_misfd']); if($dtc_misfd == '') {$dtc_misfd=$nd;}
$dtc_note= stripslashes($aq2['dtc_note']); if($dtc_note == '') {$dtc_note=$nd;}
$fot_collocazione= stripslashes($aq2['fot_collocazione']); if($fot_collocazione == '') {$fot_collocazione=$nd;}


?>

<div class="inner">
 <div class="toggle check bassa">
  <div class="sezioni <?php echo $bgSez; ?>" style="border:none !important"><h2 class="h2aperto">DESCRIZIONE FONTE BIBLIOGRAFICA</h2></div>
  <div class="slide">
   <table class="mainData" style="width:98% !important;">
    <tr>
     <td width="50%;">
      <label>TITOLO</label>
      <div class="valori"><?php echo($titolo); ?></div>
      <br/>
      <label>SOGGETTO</label>
      <div class="valori"><?php echo($soggetto); ?></div>
      <br/>
      <label>AUTORE</label>
      <div class="valori"><?php echo($autore); ?></div>
      <br/>
      <label>NOTE AUTORE</label>
      <div class="valori"><?php echo($notenome); ?></div>
      <br/>
      <label>SPECIFICI ELEMENTI DI INTERESSE</label>
      <div class="valori"><?php echo($contenuto); ?></div>
     </td>
     <td>
      <label>LIVELLO BIBLIOGRAFICO</label>
      <div class="valori"><?php echo($livbib); ?></div>
      <br/>
      <label>TIPOLOGIA DOCUMENTO</label>
      <div class="valori"><?php echo($tipo); ?></div>
      <br/>
      <label>EDIZIONE</label>
      <div class="valori"><?php echo($edizione); ?></div>
      <br/>
      <label>PERIODICITA'</label>
      <div class="valori"><?php echo($periodi); ?></div>
      <br/>
      <label>DESCRIZIONE FISICA</label>
      <div class="valori"><?php echo($descrizione); ?></div>
      <br/>
      <label>LINGUA</label>
      <div class="valori"><?php echo($lingua); ?></div>
      <br/>
      <label>NOTE</label>
      <div class="valori"><?php echo($note); ?></div>
     </td>
    </tr>
<?php if($_SESSION['username']!='guest') {?>
    <tr>
     <td colspan="2">
      <label class="update" id="biblio2_dsc_fonte">modifica sezione</label>
     </td>
    </tr>
<?php } ?>
   </table>
   <div class="updateContent" style="display:none">
    <?php require("inc/form_update/biblio2_dsc_fonte.php"); ?>
   </div>
  </div>
 </div>
</div>

<div class="inner">
 <div class="check bassa">
  <h2 class="h2aperto">DESCRIZIONE FOTOGRAFIA</h2>
   <table class="mainData" style="width:98% !important;">
    <tr>
     <td width="50%;">
      <label>TITOLO</label>
      <div class="valori"><?php echo($sog_titolo); ?> </div>
     </td>
     <td>
      <label>AUTORE</label>
      <div class="valori"><?php echo($sog_autore); ?> </div>
     </td>
    </tr>
    <tr>
     <td>
      <label>SOGGETTO</label>
      <div class="valori"><?php echo($sog_sogg); ?> </div>
     </td>
     <td>
      <label>NOTE</label>
      <div class="valori"><?php echo($sog_note); ?> </div>
     </td>
    </tr>
    <?php if($_SESSION['username']!='guest') {?>
    <tr>
     <td colspan="2">
      <label class="update" id="foto2_descr">modifica sezione</label>
     </td>
    </tr>
    <?php } ?>
   </table>
   <div class="updateContent" style="display:none">
    <?php require("inc/form_update/foto2_descr.php"); ?>
   </div>
 </div>
 <div class="toggle check bassa">
  <div class="sezioni <?php echo $bgSez; ?>"><h2>DATI TECNICI</h2></div>
  <div class="slide">
   <table class="mainData" style="width:98% !important;">
    <tr>
     <td width="50%;">
      <label>ACQUISIZIONE</label>
      <div class="valori"><?php echo($dtc_mattec); ?></div>
     </td>
     <td></td>
    </tr>
    <tr>
     <td>
      <label>BN/COLORE</label>
      <div class="valori"><?php echo($dtc_icol); ?></div>
     </td>
     <td>
      <label>FORMATO FILE</label>
      <div class="valori"><?php echo($dtc_ffile); ?></div>
     </td>
    </tr>
    <tr>
     <td>
      <label>MISURA STAMPA</label>
      <div class="valori"><?php echo($dtc_misst); ?></div>
     </td>
     <td>
      <label>DIMENSIONE FOTO DIGITALE</label>
      <div class="valori"><?php echo($dtc_misfd); ?></div>
     </td>
    </tr>
    <tr>
     <td>
      <label>PRESENZA NEGATIVI</label>
      <div class="valori"><?php echo($dtc_presneg); ?></div>
     </td>
     <td>
      <label>NOTE</label>
      <div class="valori"><?php echo($dtc_note); ?></div>
     </td>
    </tr>
    <?php if($_SESSION['username']!='guest') {?>
    <tr>
     <td colspan="2">
      <label class="update" id="foto2_datitec">modifica sezione</label>
     </td>
    </tr>
    <?php } ?>
   </table>
   <div class="updateContent" style="display:none">
    <?php require("inc/form_update/foto2_datitec.php"); ?>
   </div>
  </div>
 </div>
</div>
