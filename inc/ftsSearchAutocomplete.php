<?php
require('db.php');
$term = $_GET["term"];

$query = ("
SELECT * FROM ts_stat ('SELECT
  coalesce(scheda.scheda_vector,'') 
  ||coalesce(livind.livind_vector,'')
  ||coalesce(crono.crono_vector,'')
  ||coalesce(prv.ricerca_vector,'')
  ||coalesce(cmp.ricerca_vector,'')
  ||coalesce(com_ai.comune_vector,'')
  ||coalesce(loc_ai.localita_vector,'')
  ||coalesce(ind_ai.indirizzo_vector,'')
  ||coalesce(ana.anagrafica_vector,'')
  ||coalesce(conserv.conserv_vector,'')
  ||coalesce(altrif.altrif_vector,'')
  ||coalesce(tipo.dsc_tipol_vector,'')
  ||coalesce(foto1.foto1_vector,'')
  ||coalesce(foto2.foto2_vector,'')
  as vettori
FROM 
  scheda
left join archeo on archeo.id_scheda = scheda.id
left join altrif on altrif.scheda = scheda.id
left join lista_dsc_tipol tipo on tipo.id = archeo.sit_tipol
left join foto on foto.id_scheda = scheda.id
left join foto1 on foto1.dgn_numsch1 = foto.dgn_numsch
left join foto2 on foto2.dgn_numsch2 = foto.dgn_numsch
inner join aree_scheda as_ai on as_ai.id_scheda = scheda.id
inner join aree aai on aai.id=as_ai.id_area
inner join comune com_ai on com_ai.id = aai.id_comune
inner join localita loc_ai on loc_ai.id = aai.id_localita
inner join indirizzo ind_ai on ind_ai.id = aai.id_indirizzo
inner join lista_dgn_livind livind on livind.id = scheda.dgn_livind
inner join cronologia crono on crono.id_scheda = scheda.id
inner join ricerca prv on prv.id = scheda.prv_id
inner join ricerca cmp on cmp.id = scheda.cmp_id
inner join anagrafica ana on ana.id = scheda.ana_id
inner join lista_stato_conserv conserv on conserv.id = scheda.scn_id
WHERE scheda.fine = 2 and cmp.hub = 2')
where word ilike '".$term."%'
order by word asc;
");

$exec = pg_query($connection, $query);

$return_arr = array();  
while ($row = pg_fetch_assoc($exec)) {
  $row_array['value'] = $row['word'].'*';
  array_push($return_arr,$row_array);
}
echo json_encode($return_arr);
?>

