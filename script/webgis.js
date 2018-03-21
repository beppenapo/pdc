/******************************************************************************/
/*****************  FUNZIONI OPENLAYERS  ******************************************/
/******************************************************************************/
var gsat, osm, comuni, toponomastica, catasto1859, catasto1980, pergine, aree_foto, aree_carto, aree_orale, aree_biblio;
var highlightLayer, listalayer, control, hover,actLayer;
var info, extent, highlightCtrl, selectCtrl, pan, zoomin, cqlHub; //funzioni o comandi
wms = 'http://localhost:8080/geoserver/pdc/wms';
wfs = 'http://localhost:8080/geoserver/pdc/wfs';
bingKey = 'Arsp1cEoX9gu-KKFYZWbJgdPEa8JkRIUkxcPr8HBVSReztJ6b0MOz3FEgmNRd4nM';
format = 'image/png';
function init() {
    OpenLayers.ProxyHost = "/cgi-bin/proxy.cgi?url=";
    map = new OpenLayers.Map ("map", {
        controls:[
            new OpenLayers.Control.Navigation(),
            new OpenLayers.Control.Zoom(),
            new OpenLayers.Control.MousePosition({div:document.getElementById("coord")}),
        ],
        resolutions: [156543.03390625, 78271.516953125, 39135.7584765625, 19567.87923828125, 9783.939619140625, 4891.9698095703125, 2445.9849047851562, 1222.9924523925781, 611.4962261962891, 305.74811309814453, 152.87405654907226, 76.43702827453613, 38.218514137268066, 19.109257068634033, 9.554628534317017, 4.777314267158508, 2.388657133579254, 1.194328566789627, 0.5971642833948135, 0.29858214169740677, 0.14929107084870338, 0.07464553542435169, 0.037322767712175846, 0.018661383856087923, 0.009330691928043961, 0.004665345964021981, 0.0023326729820109904, 0.0011663364910054952, 5.831682455027476E-4, 2.915841227513738E-4, 1.457920613756869E-4],
        maxResolution: 'auto',
        units: 'm',
        projection: new OpenLayers.Projection("EPSG:3857"),
        displayProjection: new OpenLayers.Projection("EPSG:4326")
    });
    var scalebar = new OpenLayers.Control.ScaleBar({div:document.getElementById("scalebar")});
    map.addControl(scalebar);

    proj900913 = new OpenLayers.Projection("EPSG:900913");
    proj4326 = new OpenLayers.Projection("EPSG:4326");

    gsat = new OpenLayers.Layer.Bing({name: "Aerial",key: bingKey,type: "Aerial"});
    map.addLayer(gsat);
    osm = new OpenLayers.Layer.OSM();
    map.addLayer(osm);

    comuni = new OpenLayers.Layer.WMS("comuni", wms,{
        srs: 'EPSG:3857',
        layers: 'pdc:comuni_bassa',
        styles: '',
        format: format,
        transparent: true
    },{isBaseLayer: false},{singleTile: true, ratio: 1},{ tileSize: new OpenLayers.Size(256,256)}
    );
    map.addLayer(comuni);
    //comuni.setVisibility(false);

    catasto1859 = new OpenLayers.Layer.WMS("catasto 1859", wms,{
        LAYERS: 'pdc:1859',
        STYLES: '',
        format: format,
        tiled: true,
        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom,
        transparent: true
    }
    ,{buffer: 0, isBaseLayer: false,tileSize: new OpenLayers.Size(512,512)}
    );
    map.addLayer(catasto1859);
    catasto1859.setVisibility(false);

    catasto1980 = new OpenLayers.Layer.WMS("catasto 1980", wms,{
        LAYERS: 'pdc:1980',
        STYLES: '',
        format: format,
        tiled: true,
        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom,
        transparent: true
    },{
        buffer: 0,isBaseLayer: false, tileSize: new OpenLayers.Size(512,512)
    });
    map.addLayer(catasto1980);
    catasto1980.setVisibility(false);

    pergine = new OpenLayers.Layer.WMS("pergine", wms,{
        LAYERS: 'pdc:pergine',
        STYLES: '',
        format: format,
        tiled: true,
        tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom,
        transparent: true
    },{
        buffer: 0, isBaseLayer: false, tileSize: new OpenLayers.Size(512,512)
    });
    map.addLayer(pergine);
    pergine.setVisibility(false);

    aree_biblio = new OpenLayers.Layer.WMS("Aree bibliografiche", wms,{
        srs: 'EPSG:3857',
        layers: ['pdc:ai_biblio_poly'],
        CQL_FILTER: cql,
        styles: 'biblioAvs',
        format: format,
        transparent: true
    }
    ,{isBaseLayer: false,singleTile: true, ratio: 1, tileSize: new OpenLayers.Size(256,256)});
    map.addLayer(aree_biblio);
    aree_biblio.setVisibility(false);

    aree_foto = new OpenLayers.Layer.WMS("Aree foto",wms,{
        srs: 'EPSG:3857',
        layers: ['pdc:aree_foto_poly'],
        CQL_FILTER: cql,
        styles: 'fotoAvs',
        format: format,
        transparent: true
    },{isBaseLayer: false,singleTile: true, ratio: 1, tileSize: new OpenLayers.Size(256,256)});
    map.addLayer(aree_foto);
    aree_foto.setVisibility(false);

    aree_orale = new OpenLayers.Layer.WMS("Aree orale", wms,{
        srs: 'EPSG:3857',
        layers: ['pdc:aree_orale_poly'],
        CQL_FILTER: cql,
        styles: '',
        format: format,
        transparent: true
    },{isBaseLayer: false,singleTile: true, ratio: 1,tileSize: new OpenLayers.Size(256,256)});
    map.addLayer(aree_orale);
    aree_orale.setVisibility(false);

    aree_carto = new OpenLayers.Layer.WMS("Aree cartografia", wms,{
        srs: 'EPSG:3857',
        layers: ['pdc:aree_carto_poly'],
        CQL_FILTER: cql,
        styles: 'cartoAvs',
        format: format,
        transparent: true
    },{isBaseLayer: false,singleTile: true, ratio: 1,tileSize: new OpenLayers.Size(256,256)});
    map.addLayer(aree_carto);
    aree_carto.setVisibility(false);

    var s = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({fillOpacity:0,strokeOpacity:0}),
        "select": new OpenLayers.Style({strokeColor: "#1D22CF",strokeWidth:3,fillColor: "#1D22CF", fillOpacity:0.6, graphicZIndex: 2}),
        "active": new OpenLayers.Style({fillColor: "#7578F5", fillOpacity:0.6, graphicZIndex: 2})
    });
    var hiLy = ["area_int_poly", "area_int_line"]
    highlightLayer = new OpenLayers.Layer.Vector("Highlighted", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        styleMap: s,
        protocol: new OpenLayers.Protocol.WFS({
            version:     "1.0.0",
            url:         wfs,
            featureType: hiLy,
            featureNS:   "http://localhost/pdc",
            srsName:     "EPSG:3857",
            geometryName:"the_geom"
      })
  });
  map.addLayer(highlightLayer);

  actLayer = new OpenLayers.Layer.Vector("Active", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        styleMap: s,
        protocol: new OpenLayers.Protocol.WFS({
            version:     "1.0.0",
            url:         wfs,
            featureType: "area_int_poly",
            featureNS:   "http://localhost/pdc",
            srsName:     "EPSG:3857",
            geometryName:"the_geom",
            schema:      "http://localhost:8080/geoserver/pdc/wfs?service=WFS&version=1.0.0&request=DescribeFeatureType&TypeName=area_int_poly"
        })
    });
    map.addLayer(actLayer);

    toponomastica = new OpenLayers.Layer.WMS("Toponomastica", wms,{
        srs: 'EPSG:3857',
        layers: ['pdc:toponomastica'],
        styles: '',
        format: format,
        transparent: true
    },{isBaseLayer: false},{singleTile: true, ratio: 1},{ tileSize: new OpenLayers.Size(256,256)});
    map.addLayer(toponomastica);

    listalayer= [aree_biblio, aree_foto, aree_orale,aree_carto];

    info = new OpenLayers.Control.WMSGetFeatureInfo({
        url: wms,
        title: 'Informazioni sui livelli interrogati',
        queryVisible: true,
        layers: listalayer,
        infoFormat: 'application/vnd.ogc.gml',
        vendorParams: {CQL_FILTER: cql},
        //vendorParams: {buffer: 10},
        eventListeners: {
            getfeatureinfo: function(event) {
                var arr = new Array();
                var arrActive = new Array();
                var arrArea = new Array();
                for (var i = 0; i < event.features.length; i++) {
                    var feature = event.features[i];
                    var attributes = feature.attributes;
                    var id_ai = attributes.id_geom;
                    var id_area = attributes.id_area;
                    arr.push(id_ai);
                    arrArea.push(id_area);
                }
                $(".ai:checked").map(function(){arrActive.push($(this).attr('data-tipo'));});
                var progetto = $("input[name='projectLayer']:checked").val();
                $.ajax({
                    url: 'inc/popupAi.php',
                    type: 'POST',
                    data: {arr:arr,arrActive:arrActive,arrArea:arrArea,progetto:progetto},
                    success: function(data){
                        $("#result").animate({left:"0px"});
                        $("#resultContent").html(data);
                    }
                });
                console.log(progetto);
                console.log(arr);
                console.log(arrArea);
                console.log(arrActive);
            }
        }
    });
    map.addControl(info);
    info.activate();

    var report = function(e) {OpenLayers.Console.log(e.type, e.feature.id);};

    //Storico navigazione
    var history = new OpenLayers.Control.NavigationHistory();
    map.addControl(history);

    var btnPrev = new OpenLayers.Control.Panel({
        div: document.getElementById("btnPrev"),
        displayClass:"prev"
    });

    var btnNext = new OpenLayers.Control.Panel({
        div: document.getElementById("btnNext"),
        displayClass:"next"
    });

    map.addControl(btnPrev);
    btnPrev.addControls([history.previous]);
    map.addControl(btnNext);
    btnNext.addControls([history.next]);

    pan = new OpenLayers.Control.DragPan({
        div: document.getElementById("drag"),
        isDefault: true,
        title:"Pan"
    });
    map.addControl(pan);
    pan.activate();

    zoomin = new OpenLayers.Control.ZoomBox({
        div: document.getElementById("zoomArea"),
        title:"Zoom in box",
        out: false
    });
    map.addControl(zoomin);
    zoomin.deactivate();

    var panControl = document.getElementById("drag");
    var zoomControl = document.getElementById("zoomArea");

    extent = new OpenLayers.Bounds(1216522,5769354,1294374,5813972);
    if (!map.getCenter()) {map.zoomToExtent(extent);}
} //end init mappa

/****** jquery ******/
$('.info').css('cursor','pointer').qtip({
    content:{attr: 'tip'},
    style: {classes: 'qtip-shadow qtip-light ui-tooltip-rounded'},
    position: {my: 'right center', at: 'left center', adjust: {x: -20}},
    show: {event: 'click'}
});
$('div.tip').qtip({
    content:{attr: 'tip'},
    style: {classes: 'qtip-shadow qtip-dark ui-tooltip-rounded'},
    position: {my: 'right center', at: 'left center', adjust: {x: -10}}
    //show: {event: 'click'}
});

$("#resHeadImg").toggle(
    function() {$("#result").animate({ left: '-290px' });},
    function() {$("#result").animate({ left: '0px' });}
);

$(".mainLink").click(function(e) {
    var div = $(this).attr('id')
    $("body").append('<form action="index.php" method="post" id="poster"><input type="hidden" name="div" value="' + div + '" /></form>');
    $("#poster").submit();
});

/***********  FUNZIONI PER LA CREAZIONE DEI LIVELLI NELLA MAPPA **************************/
/******** ACCENDI/SPEGNI TUTTE LE AREE CONTEMPORANEAMENTE ************************/
$("#areaToggle").click(function(){
    $(this).toggleClass('acceso');
    if($(this).hasClass('acceso')){
        aree_biblio.setVisibility(true);
        aree_foto.setVisibility(true);
        aree_orale.setVisibility(true);
        aree_carto.setVisibility(true);
        $('input[name=overlays]').attr('checked', true);
        $('div.legendeAree').fadeIn('fast');
    }else{
        aree_biblio.setVisibility(false);
        aree_foto.setVisibility(false);
        aree_orale.setVisibility(false);
        aree_carto.setVisibility(false);
        $('input[name=overlays]').attr('checked', false);
        $('div.legendeAree').fadeOut('fast');
    }
});

function toggleComuni(){
    if (comuni.getVisibility() == true) {comuni.setVisibility(false);}else{comuni.setVisibility(true);}
}
function toggleToponomastica(){
    if (toponomastica.getVisibility() == true) {toponomastica.setVisibility(false);}else{toponomastica.setVisibility(true);}
}
function toggle1859(){
    if (catasto1859.getVisibility() == true) {catasto1859.setVisibility(false);}else{catasto1859.setVisibility(true);}
    if (pergine.getVisibility() == true) {pergine.setVisibility(false);}else{pergine.setVisibility(true);}
}
function toggle1980(){
    if (catasto1980.getVisibility() == true) {catasto1980.setVisibility(false);}else{catasto1980.setVisibility(true);}
}
function toggleAreeBiblio(){
    if (aree_biblio.getVisibility() == true) {aree_biblio.setVisibility(false);}else{aree_biblio.setVisibility(true);}
}
function toggleAreeFoto(){
    if (aree_foto.getVisibility() == true) {aree_foto.setVisibility(false);}else{aree_foto.setVisibility(true);}
}
function toggleAreeOrale(){
    if (aree_orale.getVisibility() == true) {aree_orale.setVisibility(false);}else{aree_orale.setVisibility(true);}
}
function toggleAreeCarto(){
    if (aree_carto.getVisibility() == true) {aree_carto.setVisibility(false);}else{aree_carto.setVisibility(true);}
}
function zoomLayer(layer,ll){
    if (comuni.getVisibility() == true) {comuni.setVisibility(false);$("input#comuni").attr('checked', false);}
    if (toponomastica.getVisibility() == false) {
        toponomastica.setVisibility(true);
        $("input#"+layer).attr('checked', true);
    }
    var xy = new OpenLayers.LonLat(ll[0],ll[1]);
    var testZoom = map.getZoomForExtent(extent);
    console.log(xy);
    map.setCenter(xy,17);
}
/******************************************************************************/
/*****************  FUNZIONI JQUERY  ******************************************/
/**********************it********************************************************/
$("#formRicerca, .legendeAreeBiblio, .legendeAreeFoto, .legendeAreeOrale, .legendeAreeCarto").hide();
var $tooltip = $('<span class="sliderTip" id="sliderTip"></span>');
$("#headLogo, #headTitle").click(function(){ window.open('index.php', '_self'); });
/******************** GESTIONE ACCENSIONE LIVELLI ******************/
$("#comuni").on("change", toggleComuni);
$("#toponomastica").on("change", toggleToponomastica);
$("#catasto1859").on("change", toggle1859);
$("#catasto1980").on("change", toggle1980);

$("#aree_biblio")
    .on("change", toggleAreeBiblio)
    .click(function(){
        if($(this).attr('checked')){$(".legendeAreeBiblio").fadeIn('fast');}
        else{$(".legendeAreeBiblio").fadeOut('fast');}
});

$("#aree_foto")
    .on("change", toggleAreeFoto)
    .click(function(){
        if($(this).attr('checked')){$(".legendeAreeFoto").fadeIn('fast');}
        else{$(".legendeAreeFoto").fadeOut('fast');}
});

$("#aree_orale")
    .on("change", toggleAreeOrale)
    .click(function(){
        if($(this).attr('checked')){$(".legendeAreeOrale").fadeIn('fast');}
        else{$(".legendeAreeOrale").fadeOut('fast');}
});
$("#aree_carto")
    .on("change", toggleAreeCarto)
    .click(function(){
        if($(this).attr('checked')){$(".legendeAreeCarto").fadeIn('fast');}
        else{$(".legendeAreeCarto").fadeOut('fast');}
});

/*****************   COMANDI PER INTERAGIRE CON LA MAPPA ***********************/
$("#zoomMax").click(function(){map.zoomToExtent(extent);});
$("#topoSearch select").change(function(){
    var ll = $(this).val().split(',');
    var layer = "toponomastica";
    zoomLayer(layer,ll);
    //console.log("ll: "+ll);
});
$("#zoomArea").click(function(){
    $(this).addClass('attivo');
    $('#drag').removeClass('attivo');
    zoomin.activate();
    pan.deactivate();
});
$("#drag").click(function(){
    $(this).addClass('attivo');
    $('#zoomArea').removeClass('attivo');
    zoomin.deactivate();
    pan.activate();
});

$("input[name='projectLayer']").on("change", function(){
    var v = ($(this).val()==63)?"(progetto = 63 or progetto = 70)":"progetto = 70";
    cql = "hub = 2 AND "+v;
    cqlBiblio = cql;
    cqlFoto = cql;
    cqlAudio = cql;
    cqlCarto = cql;
    info_filter = cqlBiblio+";"+cqlFoto+";"+cqlAudio+";"+cqlCarto;
    info.vendorParams= {'CQL_FILTER': info_filter};
    console.log(cql);
    aree_biblio.params.CQL_FILTER = cql;
    aree_foto.params.CQL_FILTER = cql;
    aree_orale.params.CQL_FILTER = cql;
    aree_carto.params.CQL_FILTER = cql;
    aree_biblio.redraw();
    aree_foto.redraw();
    aree_orale.redraw();
    aree_carto.redraw();
});

/******************** GESTIONE SLIDER *******************************************/
$( "#slider" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 2000,
    value: 2000,
    slide: function( event, ui ) { $(".sliderTip").text(ui.value); }
})
.find(".ui-slider-handle")
.append($tooltip);
$(".sliderTip").text($("#slider").slider('option','value'));

$("#sliderArea,#amountAree").hide();
$('input[name=overlays]').on("change", function(){
    if($('input[name=overlays]').is(':checked')){$("#sliderArea, #amountAree").show(); }else{ $("#sliderArea,#amountAree").hide(); }
});

$("#sliderArea").slider({
    range: "min",
    min: 0,
    max: 100,
    value: 100,
    slide: function(e, ui) {
        aree_biblio.setOpacity(ui.value / 100);
        aree_foto.setOpacity(ui.value / 100);
        aree_orale.setOpacity(ui.value / 100);
        aree_carto.setOpacity(ui.value / 100);
        $('.legendeAreeBiblio').css('background-color', 'rgba(255,159,54,'+ui.value/100+')');
        $('.legendeAreeFoto').css('background-color', 'rgba(40,194,229,'+ui.value/100+')');
        $('.legendeAreeOrale').css('background-color', 'rgba(82,199,52,'+ui.value/100+')');
        $('.legendeAreeCarto').css('background-color', 'rgba(255,92,118,'+ui.value/100+')');
    }
});
$("#amountAree").text($("#sliderArea").slider("value") + "%");
