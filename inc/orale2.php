<?php
$nd = 'Dato non presente';
$f = 'fonti_orali2';
$q2 =  "SELECT
    $f.id,
    $f.dsc_segnatura2,
    $f.dsc_denom,
    $f.dsc_conten,
    $f.dsc_categ,
    $f.dsc_occas,
    $f.dsc_durata,
    $f.dan_elstrutt2 as dan_elstrutt,
    $f.dan_incverb2 as dan_incverb,
    $f.dan_trascr2 as dan_trascr,
    $f.dan_motiv2 as dan_motiv,
    $f.com_nvoci,
    $f.com_modesec,
    $f.att_datipers,
    $f.autore,
    $f.att_note,
    $f.att_collden,
    $f.att_collnote,
    $f.loc_luogo,
    $f.loc_contst,
    $f.sup_tipreg,
    $f.sup_formato,
    $f.sup_freqvel,
    $f.sup_attec,
    $f.sup_oss,
    $f.riv_tpriv,
    $f.riv_formato,
    $f.riv_descform
FROM scheda, $f WHERE $f.dgn_numsch2 = scheda.dgn_numsch AND scheda.id = $id;";
$r2 = pg_query($connection, $q2);
$a2 = pg_fetch_array($r2, 0, PGSQL_ASSOC);
$rC2 = pg_num_rows($r2);
$idOral2 = $a2['id'];

$dsc_segnatura2 = stripslashes($a2['dsc_segnatura2']); if($dsc_segnatura2       == '') {$dsc_segnatura2=$nd;}
$dsc_denom      = stripslashes($a2['dsc_denom']); if($dsc_denom       == '') {$dsc_denom=$nd;}
$dsc_conten     = stripslashes($a2['dsc_conten']); if($dsc_conten      == '') {$dsc_conten=$nd;}
$dsc_categ      = stripslashes($a2['dsc_categ']); if($dsc_categ       == '') {$dsc_categ=$nd;}
$dsc_occas      = stripslashes($a2['dsc_occas']); if($dsc_occas       == '') {$dsc_occas=$nd;}
$dsc_durata     = stripslashes($a2['dsc_durata']); if($dsc_durata      == '') {$dsc_durata=$nd;}
$dan_elstrutt   = stripslashes($a2['dan_elstrutt']); if($dan_elstrutt    == '') {$dan_elstrutt=$nd;}
$dan_incverb    = stripslashes($a2['dan_incverb']); if($dan_incverb     == '') {$dan_incverb=$nd;}
$dan_trascr     = stripslashes($a2['dan_trascr']); if($dan_trascr      == '') {$dan_trascr=$nd;}
$dan_motiv      = stripslashes($a2['dan_motiv']); if($dan_motiv       == '') {$dan_motiv=$nd;}
$com_nvoci      = stripslashes($a2['com_nvoci']); if($com_nvoci       == '') {$com_nvoci=$nd;}
$com_modesec    = stripslashes($a2['com_modesec']); if($com_modesec     == '') {$com_modesec=$nd;}
$att_note       = stripslashes($a2['att_note']); if($att_note        == '') {$att_note=$nd;}
$att_collden    = stripslashes($a2['att_collden']); if($att_collden     == '') {$att_collden=$nd;}
$att_collnote   = stripslashes($a2['att_collnote']); if($att_collnote    == '') {$att_collnote=$nd;}
$loc_luogo      = stripslashes($a2['loc_luogo']); if($loc_luogo       == '') {$loc_luogo=$nd;}
$loc_contst     = stripslashes($a2['loc_contst']); if($loc_contst      == '') {$loc_contst=$nd;}
$sup_tipreg     = stripslashes($a2['sup_tipreg']); if($sup_tipreg      == '') {$sup_tipreg=$nd;}
$sup_formato    = stripslashes($a2['sup_formato']); if($sup_formato     == '') {$sup_formato=$nd;}
$sup_freqvel    = stripslashes($a2['sup_freqvel']); if($sup_freqvel     == '') {$sup_freqvel=$nd;}
$sup_attec      = stripslashes($a2['sup_attec']); if($sup_attec       == '') {$sup_attec=$nd;}
$sup_oss        = stripslashes($a2['sup_oss']); if($sup_oss         == '') {$sup_oss=$nd;}
$riv_tpriv      = stripslashes($a2['riv_tpriv']); if($riv_tpriv       == '') {$riv_tpriv=$nd;}
$riv_formato    = stripslashes($a2['riv_formato']); if($riv_formato     == '') {$riv_formato=$nd;}
$riv_descform   = stripslashes($a2['riv_descform']); if($riv_descform    == '') {$riv_descform=$nd;}


$intervistato = ($a2['att_datipers']== '')? $nd : stripslashes($a2['att_datipers']);
$autore = ($a2['riv_descform']== '')? $nd : stripslashes($a2['riv_descform']);

?>


   <div class="inner">

   <div class="toggle">
    <div class="sezioni <?php echo $bgSez; ?>" style="border-top:none !important; border-bottom:1px solid #96867B">
     <h2>SEGNATURA/COLLOCAZIONE</h2>
    </div>
    <div class="slide" style="border-bottom:1px solid #96867B">
     <table class="mainData" style="width:98% !important;">
      <tr>
       <td width="50%;">
        <br/>
        <div class="valori"><?php echo($dsc_segnatura2);?></div>
       </td>
       <td>
       </td>
      </tr>
       <?php if($_SESSION['username']!='guest') {?>
          <tr>
           <td colspan="2">
             <label class="update" id="oral2" rel="sez_segnatura">modifica sezione</label>
           </td>
          </tr>
       <?php } ?>
      </table>


    </div>
   </div>
   <h2 class="h2aperto">DESCRIZIONE AUDIO-VIDEO</h2>

      <table class="mainData" style="width:98% !important;">
       <tr>
        <td width="50%;">
         <label>TIPOLOGIA FONTE AUDIO-VIDEO</label>
         <div class="valori"><?php echo($dsc_denom); ?></div>
         <br/>
         <label>CONTENUTO</label>
         <div class="valori"><?php echo(nl2br($dsc_conten)); ?></div>
        </td>
        <td>
         <label>OCCASIONE O MOMENTO DI RACCOLTA</label>
         <div class="valori"><?php echo($dsc_occas); ?></div>
         <br/>
         <label>DURATA</label>
         <div class="valori"><?php echo($dsc_durata); ?></div>
        </td>
       </tr>
       <?php if($_SESSION['username']!='guest') {?>
          <tr>
           <td colspan="2">
             <label class="update" id="oral2" rel="sez_descrizione">modifica sezione</label>
           </td>
          </tr>
       <?php } ?>
      </table>

      <div class="toggle">
        <div class="sezioni <?php echo $bgSez; ?>"><h2>DATI ANALITICI DEL CONTENUTO</h2></div>
        <div class="slide">
           <table class="mainData" style="width:98% !important;">
            <tr>
             <td width="50%;">
               <label>INDICE DEGLI ARGOMENTI</label>
               <div class="valori" style="height:250px; overflow:auto;"><?php echo(nl2br($dan_elstrutt)); ?></div>
             </td>
             <td>
              <label>TRASCRIZIONE</label>
              <div class="valori"><?php echo($dan_trascr); ?></div>
              <br/>
              <label>NOTE</label>
              <div class="valori"><?php echo($dan_motiv); ?></div>
              <br/>
             </td>
           </tr>
          </table>
       <?php if($_SESSION['username']!='guest') {?>
          <tr>
           <td colspan="2">
             <label class="update" id="oral2" rel="sez_analitici">modifica sezione</label>
           </td>
          </tr>
       <?php } ?>
        </div>
      </div>
      <div class="toggle">
        <div class="sezioni <?php echo $bgSez; ?>"><h2>DATI DI REALIZZAZIONE</h2></div>
        <div class="slide">
           <table class="mainData" style="width:98% !important;">
            <tr>
             <td width="50%;">
               <label>INTERVISTATO</label>
               <div class="valori"><?php echo $intervistato; ?></div>
               <br/>
               <label>DESCRIZIONE CONTESTO</label>
               <div class="valori"><?php echo($loc_contst); ?></div>
             </td>
             <td>
                <label>AUTORE/INTERVISTATORE</label>
                <div class="valori"><?php echo $autore; ?></div>
              <label>NOTE</label>
              <div class="valori"><?php echo($att_note); ?></div>
             </td>
           </tr>
          </table>
       <?php if($_SESSION['username']!='guest') {?>
          <tr>
           <td colspan="2">
             <label class="update" id="oral2" rel="sez_intervistato">modifica sezione</label>
           </td>
          </tr>
       <?php } ?>
        </div>
      </div>
      <div class="toggle">
        <div class="sezioni <?php echo $bgSez; ?>"><h2>SUPPORTO</h2></div>
        <div class="slide">
           <table class="mainData" style="width:98% !important;">
            <tr>
             <td width="50%;">
               <label>TIPO REGISTRAZIONE</label>
               <div class="valori"><?php echo($sup_tipreg); ?></div>
               <br/>
               <label>FORMATO</label>
               <div class="valori"><?php echo($sup_formato); ?></div>
             </td>
             <td>
              <label>ATTREZZATURE TECNICHE</label>
              <div class="valori"><?php echo($sup_attec); ?></div>
              <br/>
              <label>OSSERVAZIONI</label>
              <div class="valori"><?php echo($sup_oss); ?></div>
             </td>
           </tr>
          </table>
       <?php if($_SESSION['username']!='guest') {?>
          <tr>
           <td colspan="2">
             <label class="update" id="oral2" rel="sez_supporto">modifica sezione</label>
           </td>
          </tr>
       <?php } ?>
        </div>
      </div>
   </div>


      <div class="updateContent" style="display:none">
        <?php require("inc/form_update/oral2.php"); ?>
      </div>
