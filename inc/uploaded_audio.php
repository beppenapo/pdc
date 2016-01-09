<?php
ob_start();
$id = $_POST['schedaFoto'];
$allowedExts = array(".mp3", ".ogg", ".wav");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

echo "id: ".$id."<br/> file: ".$_FILES["file"]["name"]."<br/> ext: ".$extension."<br/> mime: ".$_FILES["file"]["type"];
return false;

if ((($_FILES["file"]["type"] == "audio/mpeg")
|| ($_FILES["file"]["type"] == "audio/ogg")
|| ($_FILES["file"]["type"] == "audio/wav"))
&& ($_FILES["file"]["size"] < 2000000000)
&& in_array($extension, $allowedExts))
  {
  if ($_FILES["file"]["error"] > 0){echo "Errore nel caricamento: " . $_FILES["file"]["error"] . "<br>";
  }else{
    if (file_exists("../audio/" . $_FILES["file"]["name"]))
      {
      echo $_FILES["file"]["name"] . " esiste già un file con questo nome. ";
      }
    else
      {
       $file = $_FILES["file"]["name"];
       require("db.php");
       $up=("insert into file(id_scheda, path, tipo)values($id, '$file', 2);");
       $exec = pg_query($connection, $up);
       if($exec) {move_uploaded_file($_FILES["file"]["tmp_name"], "../audio/" . $_FILES["file"]["name"]);        }
       echo "File caricato!<br/>";
       echo "Entro 5 secondi verrai reindirizzato nella pagina della fonte...<br/>";
       echo "Se la pagina impiega troppo tempo <a href='../scheda_archeo.php?id=".$id."'>clicca qui</a> per tornare alla pagina della fonte";
      }
    }
  }
else
  {
  echo "File non valido o non selezionato! ".$_FILES["file"]["type"];
  }
header("Refresh: 3; URL=../scheda_archeo.php?id=".$id);
?>
