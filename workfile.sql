select
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
order by a.nome asc;
