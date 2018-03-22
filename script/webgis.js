function init() {
    OpenLayers.ProxyHost = proxy;
    map = new OpenLayers.Map ("map", opzioni);
    gsat = new OpenLayers.Layer.Bing({name: "Aerial",key: bingKey,type: "Aerial"});
    osm = new OpenLayers.Layer.OSM();
    comuni = new OpenLayers.Layer.WMS("comuni", wms,
        {layers: 'pdc:comuni_bassa', format: format, transparent: true}
        ,{isBaseLayer: false, singleTile: true, ratio: 1, tileSize:tile256}
    );
    toponomastica = new OpenLayers.Layer.WMS("Toponomastica", wms,
        {layers: ['pdc:toponomastica'], format: format,transparent: true}
        ,{isBaseLayer: false},{singleTile: true, ratio: 1},{ tileSize:tile256}
    );
    catasto1859 = new OpenLayers.Layer.WMS("catasto 1859", wms,
        {layers: ['pdc:1859','pdc:pergine'],format: format, tiled: true, tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom, transparent: true}
        ,{visibility:false,buffer: 0, isBaseLayer: false,tileSize:tile512}
    );
    catasto1980 = new OpenLayers.Layer.WMS("catasto 1980", wms,
        {layers: 'pdc:1980', format: format, tiled: true, tilesOrigin : map.maxExtent.left + ',' + map.maxExtent.bottom, transparent: true}
        ,{visibility:false, buffer: 0,isBaseLayer: false, tileSize:tile512}
    );
    aree_foto = new OpenLayers.Layer.WMS("Aree foto",wms,
        {layers:['pdc:foto'], CQL_FILTER:cql, format:format, transparent:true}
        ,{visibility:false,isBaseLayer:false,singleTile:true, ratio:1, tileSize:tile256}
    );
    aree_carto = new OpenLayers.Layer.WMS("Aree cartografia", wms,
        {layers: ['pdc:cartografia'], CQL_FILTER: cql, format:format, transparent: true}
        ,{visibility:false,isBaseLayer: false,singleTile: true, ratio: 1,tileSize:tile256}
    );
    aree_biblio = new OpenLayers.Layer.WMS("Aree bibliografiche", wms,
        {layers: ['pdc:pubblicazioni'], CQL_FILTER: cql, format: format, transparent: true}
        ,{visibility:false,isBaseLayer: false,singleTile: true, ratio: 1, tileSize:tile256}
    );
    aree_orale = new OpenLayers.Layer.WMS("Aree orale", wms,
        {layers: ['pdc:orali'], CQL_FILTER: cql, format: format, transparent: true}
        ,{visibility:false,isBaseLayer: false,singleTile: true, ratio: 1,tileSize:tile256}
    );

    stile = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style({fillOpacity:0,strokeOpacity:0}),
        "select": new OpenLayers.Style({strokeColor: "#1D22CF",strokeWidth:3,fillColor: "#1D22CF", fillOpacity:0.6, graphicZIndex: 2}),
        "active": new OpenLayers.Style({fillColor: "#7578F5", fillOpacity:0.6, graphicZIndex: 2})
    });
    hiLy = ["area_int_poly", "area_int_line"];
    highlightLayer = new OpenLayers.Layer.Vector("Highlighted", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        styleMap: stile,
        protocol: new OpenLayers.Protocol.WFS({version:"1.0.0",url:wfs,featureType:hiLy, featureNS:nameSpace, srsName:"EPSG:3857",geometryName:"the_geom"})
    });

    actLayer = new OpenLayers.Layer.Vector("Active", {
        strategies: [new OpenLayers.Strategy.BBOX()],
        styleMap: stile,
        protocol: new OpenLayers.Protocol.WFS({version:"1.0.0",url:wfs, featureType:hiLy[0], featureNS:nameSpace, srsName:"EPSG:3857", geometryName:"the_geom",schema: schema+hiLy[0]})
    });

    map.addLayers([gsat,osm,comuni,catasto1859,catasto1980,aree_biblio,aree_foto,aree_orale,aree_carto,highlightLayer,actLayer,toponomastica]);

    listalayer= [aree_biblio, aree_foto, aree_orale,aree_carto];
    info = new OpenLayers.Control.WMSGetFeatureInfo({
        url: wms,
        title: 'Informazioni sui livelli interrogati',
        queryVisible: true,
        layers: listalayer,
        infoFormat: 'application/vnd.ogc.gml',
        vendorParams: {CQL_FILTER: cql},
        eventListeners: {
            getfeatureinfo: function(event) {
                arr = new Array();
                arrActive = new Array();
                arrArea = new Array();
                for (var i = 0; i < event.features.length; i++) {
                    feature = event.features[i];
                    attributes = feature.attributes;
                    id_ai = attributes.id_geom;
                    id_area = attributes.id_area;
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
            }
        }
    });

    report = function(e) {OpenLayers.Console.log(e.type, e.feature.id);};

    scalebar = new OpenLayers.Control.ScaleBar({div:scalebar});
    pan = new OpenLayers.Control.DragPan({div:panControl,isDefault: true,title:"Pan"});
    zoomin = new OpenLayers.Control.ZoomBox({div: zoomControl, title:"Zoom in box",out: false});
    var history = new OpenLayers.Control.NavigationHistory();
    btnPrev = new OpenLayers.Control.Panel({div:btnPrev, displayClass:"prev"});
    btnNext = new OpenLayers.Control.Panel({div:btnNext, displayClass:"next"});

    map.addControl(info);
    map.addControl(scalebar);
    map.addControl(pan);
    map.addControl(zoomin);
    map.addControl(history);
    map.addControl(btnPrev);
    map.addControl(btnNext);
    btnPrev.addControls([history.previous]);
    btnNext.addControls([history.next]);

    info.activate();
    pan.activate();
    zoomin.deactivate();

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
    v = ($(this).val()==63)?"(progetto = 63 or progetto = 70)":"progetto = 70";
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
