<?php
$t1 = "select * from tag1 order by definizione asc;"; $t1res = pg_query ($connection, $t1);
$t2 = "select * from tag2 order by definizione asc;"; $t2res = pg_query ($connection, $t2);
$t3 = "select * from tag3 order by definizione asc;"; $t3res = pg_query ($connection, $t3);
$t4 = "select * from tag4 order by definizione asc;"; $t4res = pg_query ($connection, $t4);
$t5 = "select * from tag5 order by definizione asc;"; $t5res = pg_query ($connection, $t5);
?>
<div id="cartoTag_form">
<label>PAROLA CHIAVE 1</label>
<select id="tag1Sel" class="form">
 <?php while($tag = pg_fetch_array($t1res)){ echo "<option value='".$tag['id']."'>".$tag['definizione']."</option>"; } ?>
</select>
<label>PAROLA CHIAVE 2</label>
<select id="tag2Sel" class="form">
 <?php while($tag = pg_fetch_array($t2res)){ echo "<option value='".$tag['id']."'>".$tag['definizione']."</option>"; } ?>
</select>
<label>PAROLA CHIAVE 3</label>
<select id="tag3Sel" class="form">
 <?php while($tag = pg_fetch_array($t3res)){ echo "<option value='".$tag['id']."'>".$tag['definizione']."</option>"; } ?>
</select>
<label>PAROLA CHIAVE 4</label>
<select id="tag4Sel" class="form">
 <?php while($tag = pg_fetch_array($t4res)){ echo "<option value='".$tag['id']."'>".$tag['definizione']."</option>"; } ?>
</select>
<label>PAROLA CHIAVE 5</label>
<select id="tag5Sel" class="form">
 <?php while($tag = pg_fetch_array($t5res)){ echo "<option value='".$tag['id']."'>".$tag['definizione']."</option>"; } ?>
</select>
 <div class="login2" style="margin-top:20px;" id="cartoTag_salva">Salva modifiche</div>
 <div class="chiudiForm login2">Annulla modifiche</div>
</div>
