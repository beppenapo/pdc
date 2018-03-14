<?php
require("main.class.php");
$obj = new Main;
if(isset($_POST['func']) && function_exists($_POST['func'])) {
    $funzione = $_POST['func'];
    $trigger = $funzione($obj);
    echo $trigger;
}
function listaSchedeCollezione($obj){
    return json_encode($obj->listaSchedeCollezione($_POST['id']));
}
function dinSel($obj){
    return json_encode($obj->dinSel($_POST['com']));

}

?>
