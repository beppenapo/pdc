<?php
include("db.php");
$id = $_POST['id'];
$old_ubi= $_POST['old_ubi'];
$localita_update= $_POST['localita_update'];
$motiv_update= $_POST['motiv_update'];
$noteUbiUpdate=pg_escape_string($_POST['noteUbiUpdate']);
if ($motiv_update && $localita_update){
  $update = ("
    BEGIN; 
    UPDATE aree_scheda SET id_area = $localita_update, id_motivazione = $motiv_update  WHERE id_scheda = $id AND id_area = $old_ubi;
    UPDATE scheda SET noteubi = '$noteUbiUpdate' WHERE id = $id;
    COMMIT;
  ");
  $result = pg_query($connection, $update);
  if(!$result){die("Errore nella query: \n" . pg_last_error($connection));}
  else {die("Salvataggio avvenuto correttamente" . pg_last_error($connection));}
}
else{
    die("Devi selezionare il campo ".($motiv_update?'Localit�' : 'Motivazione'));
}

?>
