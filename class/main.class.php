<?php
require("db.class.php");
class Main extends Db{
    public function __construct(){}

    public function listaCollezioni(){
        $sql="select
            a.id
            , l.definizione as tipo
            , nullif(a.nome, '-') as titolare
            , a.web
            , i.indirizzo ||', '||c.cap||' '||c.comune as indirizzo
            , nullif(a.mail,'-') as mail
            , a.tel||'/'||a.fax as tel
            , count(s.id) as record
        from ricerca r
        left join scheda s on s.cmp_id = r.id
        left join anagrafica a on s.ana_id = a.id
        left join comune c on a.comune = c.id
        left join indirizzo i on a.indirizzo = i.id
        left join lista_tipo_soggetto l on a.tipo_soggetto = l.id
        where r.hub = 2 and a.id <> 7 and l.definizione <> 'Non determinabile'
        group by a.id, a.nome, i.indirizzo, c.cap, c.comune, a.mail, a.tel, a.fax, l.definizione
        order by a.nome asc;";
        return $this->simpleSql($sql);
    }

    public function listaSchedeCollezione($id){
        $sql = "
        SELECT scheda.id, scheda.dgn_numsch, scheda.dgn_dnogg, cronologia.cro_spec, file.path
        FROM scheda
        INNER JOIN anagrafica ON scheda.ana_id = anagrafica.id
        INNER JOIN ricerca ON scheda.cmp_id = ricerca.id
        INNER JOIN cronologia ON cronologia.id_scheda = scheda.id
        LEFT JOIN file on file.id_scheda = scheda.id
        WHERE ricerca.hub = 2 and anagrafica.id = $id
        ORDER BY dgn_numsch ASC;
        ";
        return $this->simpleSql($sql);
    }

    public function listaLocalita($comune=null){
        $and = $comune>0 ? ' AND l.comune = '.$comune : '';
        $sql="SELECT c.comune, l.id, l.localita
        FROM aree, aree_scheda, scheda, ricerca, localita l, comune c
        WHERE l.comune = c.id
        ".$and."
            AND aree.id_localita = l.id
            AND aree_scheda.id_area = aree.nome_area
            AND aree_scheda.id_scheda = scheda.id
            AND scheda.cmp_id = ricerca.id
            AND ricerca.hub = 2
            AND (l.localita not like '-' AND l.id <> 873)
        GROUP BY c.comune, l.id, l.localita
        ORDER BY 1,3 ASC;";
        return $this->simpleSql($sql);
    }

    public function listaIndirizzi($comune=null){
        $and = $comune>0 ? ' AND i.comune = '.$comune : '';
        $sql = "SELECT c.comune, i.id, i.cap, i.indirizzo
        FROM aree, aree_scheda, scheda, ricerca, comune c, indirizzo i
        WHERE aree.id_indirizzo = i.id
            ".$and."
            AND i.comune = c.id
            AND (i.indirizzo not like '-' AND i.cap <> 0)
            AND aree_scheda.id_area = aree.nome_area
            AND aree_scheda.id_scheda = scheda.id
            AND scheda.cmp_id = ricerca.id
            AND ricerca.hub = 2
        group by c.comune, i.id, i.cap, i.indirizzo
        ORDER BY 1,3,4 ASC;";
        return $this->simpleSql($sql);
    }

    public function dinSel($com){
        $localita = $this->listaLocalita($com);
        $indirizzi = $this->listaIndirizzi($com);
        return array("localita"=>$localita, "indirizzi"=>$indirizzi);
    }
}
?>
