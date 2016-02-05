<?php 
require("inc/db.php");
if ($_SESSION['username']!='guest'){
    $idUsr = $_SESSION['id_user'];
    $tipoUsr = $_SESSION['tipo'];
    $hub = $_SESSION['hub'];
    $schede = explode(',',$_SESSION['schede']);
    $link="";
    foreach($schede as $scheda){ 
        $scheda = ltrim($scheda);
        $a = ("select * from lista_dgn_tpsch where definizione = '$scheda' and hub = 2;");
        $b = pg_query($connection, $a); 
        $c = pg_fetch_array($b);
        $link .= "<li class='link".$c["id"]."'><a href='../scheda_nuova.php?tpsch=".$c["id"]."&def=".$c["definizione"]."'>".$c["definizione"]."</a></li>";
    }
?>
<div id='utente'>
    <ul id="sessionMenu">
        <li>Ciao <?php echo($_SESSION['username']); ?>, </li>
        <li><a href="#" id="account" class='sessionLink' title="Gestisci la tua sessione di lavoro" >account <span id="accountToggle" class="oc">+</span></a>
            <ul class="submenu">
                <li><a href='../account.php' title="modifica i tuoi dati personali"> dati personali</a></li> 
                <li> <a href='inc/loginScript.php?login=no' title='Chiudi la tua sessione di lavoro'>logout</a> </li>
            </ul>
        </li>
        <li> <a href='index.php' class='sessionLink' title="Torna alla home page del sito"> home</a> </li>
        <li><a href="#" class='sessionLink' title="Cataloghi" id="catalogo"> Cataloghi <span id="cataloghiToggle" class="oc">+</span></a>
            <ul class="submenu">
                <li> <a href='../ricerca.php' title="Accedi al catalogo generale delle ricerche"> ricerche</a> </li>
                <li> <a href='../catalogo.php' title="Accedi al catalogo generale delle schede"> schede</a> </li>
                <li> <a href='../rubrica.php' title="Accedi alla rubrica condivisa"> rubrica</a> </li>
                <li> <a href='../aree.php?c=0&t=0' title="Accedi alla lista delle aree di interesse e delle ubicazioni"> aree/ubicazioni</a> </li>
            </ul>
        </li>
        <li><a href="#" id="nuova_scheda" class='sessionLink' title="Inserisci una nuova scheda" > nuova scheda <span id="schedaToggle" class="oc">+</span></a>
            <ul class="submenu" id="nuovaScheda"> <?php echo $link; ?></ul>
        </li>
        <li><a href="#" class='sessionLink' title="Modifica una lista valori" id="liste"> liste <span id="listeToggle" class="oc">+</span></a>
            <ul class="submenu">
                <li><a href='vocabolari.php' title="modifica un vocabolario"> vocabolari</a></li> 
                <li><a href='stato.php' title='modifca lista Stato'>Stato</a></li>
                <li><a href='provincia.php' title='modifca lista Provincia'>Provincia</a></li>
                <li><a href='comune.php' title='modifca lista Comune'>Comune</a></li>
                <li><a href='localita.php' title='modifca lista Localita'>Localita</a></li>
                <li><a href='indirizzo.php' title='modifca lista Indirizzo'>Indirizzo</a></li>
            </ul>
        </li>
        <?php if($_SESSION['tipo'] == 1) {?>
        <li><a href='utenti.php' class='sessionLink' title="Lista utenti">utenti</a></li>
        <?php } if($_SESSION['tipo'] < 3) {?>
        <li><a href='notepad.php' class='sessionLink' title="Lista utenti">notepad</a></li>
        <?php } ?>
    </ul>
    <div style="clear:both"></div>
</div>
<?php } ?>
