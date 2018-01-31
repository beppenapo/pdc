headH = $("#head").outerHeight(true);
windowX =  $( window ).width();
windowY =  $( window ).height();
currentYear = (new Date).getFullYear();
$(document).ready(function() {
 // la funzione toogle è deprecata dalla versione 1.9 di jquery
 // bisogna riscrivere il metodo creando la nuova funzione clickToggle che verrà chiamata al posto della vecchia toggle
    (function ($) {
        $.fn.clickToggle = function (func1, func2) {
            var funcs = [func1, func2];
            this.data('toggleclicked', 0);
            this.click(function () {
                var data = $(this).data();
                var tc = data.toggleclicked;
                $.proxy(funcs[tc], this)();
                data.toggleclicked = (tc + 1) % 2;
            });
            return this;
        };
    }(jQuery));
    $('.prevent').click(function(e){ e.preventDefault(); });
    $("#headLogo, #headTitle").on("click",function(){ window.open('index.php', '_self'); });
    if(div){mainLink(div);}
    //menù sessione
    $('.submenu').hide();
    $('#nuova_scheda')
        .click(function() { $(this).next().slideToggle(); })
        .clickToggle( function() {$('#schedaToggle').text('-');}, function() {$('#schedaToggle').text('+');});
    $('#account')
        .click(function() { $(this).next().slideToggle();})
        .clickToggle(function() {$('#accountToggle').text('-');}, function() {$('#accountToggle').text('+');});
    $('#liste')
        .click(function() { $(this).next().slideToggle();})
        .clickToggle(function() {$('#listeToggle').text('-');}, function() {$('#listaToggle').text('+');});
    $('#catalogo')
        .click(function() { $(this).next().slideToggle();})
        .clickToggle(function() {$('#catalogoToggle').text('-');}, function() {$('#catalogoToggle').text('+');});
    if(hub==2){
        $("#nuovaScheda li").each(function(){
            var remove = $( this ).attr("class");
            $( "#nuovaScheda > li:not([class='link1']):not([class='link5']):not([class='link7']):not([class='link10'])" ).remove();
        });
    }
    $('.mainLink').click(function(){
        div = $(this).attr('id');
        console.log(div);
        $('.mainLink').removeClass('attivo');
        $(this).addClass('attivo');
        $('html, body').stop().animate({scrollTop: $("#main").scrollTop()}, 800);
        $('section#main').load('inc/progettoContent.php #'+div, function(){
            $('section#main').fadeIn('slow');
            $('html, body').stop().animate({scrollTop: $("#main").offset().top-headH-100}, 800);
            $('.removeContent').click(function(){
                $('section#main').fadeOut('slow',function(){$(this).html('')});
                $('html, body').animate({scrollTop: $("#main").scrollTop()}, 800);
                $('.mainLink').removeClass('attivo');
            });
            //pulsanti tipo scheda
            $('input[name="tipoButt"]').on("click",function(){
                var label = $(this).attr('id');
                $("label[for='"+label+"']").toggleClass('labelRadioActive');
            });
            //select dinamica comune
            $("#comSel").on("change", function(){
                var com = $(this).val();
                dinSel(com);
            });
            //slider
            $(function() {
                var tooltip = function(sliderObj, ui){
                    val1 = '<span class="sliderTip1">'+ sliderObj.slider("values", 0) +'</span>';
                    val2 = '<span class="sliderTip2">'+ sliderObj.slider("values", 1) +'</span>';
                    ci=sliderObj.slider("values", 0);
                    cf=sliderObj.slider("values", 1);
                    sliderObj.children('.ui-slider-handle').first().html(val1);
                    sliderObj.children('.ui-slider-handle').last().html(val2);
                    $('#ci').val(ci);
                    $('#cf').val(cf);
                };
                $( "#slider" ).slider({
                    range: true,
                    min: 1500,
                    max: currentYear,
                    values: [ 1500, currentYear ],
                    step: 1,
                    slide: function( e, ui ){tooltip($(this),ui);},
                    create:function(e,ui){tooltip($(this),ui);}
                });
            });
            $('.ui-slider-handle').each(function(){
                $('.ui-slider-handle').first().removeClass('ui-state-default').addClass('ui-state-default1');
                $('.ui-slider-handle').last().removeClass('ui-state-default').addClass('ui-state-default2');
            });
            $("#ftsError").hide();
            //attiva ricerca
            $("#filtroButt").click(function(){
                //var data = new Array();
                var tipo = new Array();
                var fts, ci, cf;
                //valori tipo scheda
                if($("input[name=tipoButt]:checked").length < 1){
                    tipo.push(0);
                }else{
                    $("input[name=tipoButt]:checked").each(function(){
                        var t = $(this).val();
                        tipo.push(t);
                    });
                }
                //valori area geografica
                var comSel = $("#comSel").val();
                var locSel = $("#locSel").val();
                var indSel = $("#indSel").val();
                //valori full text search
                var fts1 = $('#fts1').val();fts1=fts1.slice(0, -1);fts1=fts1+':*';
                var fts2 = $('#fts2').val();fts2=fts2.slice(0, -1);fts2=fts2+':*';
                var fts3 = $('#fts3').val();fts3=fts3.slice(0, -1);fts3=fts3+':*';
                var op1 = $('#op1').val();
                var op2 = $('#op2').val();
                var ftsError;
                if(fts1 == ':*' && fts2 == ':*' && fts3 == ':*'){vect = 'no';}
                else if(fts2 == ':*' && fts3 == ':*'){vect=fts1;}
                else if(fts2 != ':*' && fts3 == ':*'){
                    if(fts1 == ':*'){ $("#ftsError").text('manca la prima parola').fadeIn('fast'); return false;}
                    else if(op1=='--'){$("#ftsError").text('manca operatore').fadeIn('fast'); return false;}
                    else{ vect=fts1+" "+op1+" "+fts2; $("#ftsError").text('').fadeOut('fast');}
                }
                else if(fts3 != ':*'){
                    if(fts1 == ':*' && fts2 == ':*'){ $("#ftsError").text('mancano le prime due parole').fadeIn('fast');  return false;}
                    else if(fts1 == ':*'){ $("#ftsError").text('manca la prima parola').fadeIn('fast');  return false;}
                    else if(fts2 == ':*'){ $("#ftsError").text('manca la seconda parola').fadeIn('fast');  return false;}
                    else if(op1=='--'){$("#ftsError").text('manca primo operatore').fadeIn('fast'); return false;}
                    else if(op2 == '--'){$("#ftsError").text('manca secondo operatore').fadeIn('fast'); return false;}
                    else{vect=fts1+" "+op1+" "+fts2+" "+op2+" "+fts3;$("#ftsError").text('').fadeOut('fast');}
                }
                //valori cronologia
                ci = $('#ci').val();
                cf = $('#cf').val();
                cerca(tipo,comSel,locSel,indSel,vect,ci,cf);
            });

            var cache = {};
            $( ".term" ).autocomplete({
                minLength: 2,
                source: function( request, response ) {
                    var term = request.term;
                    if ( term in cache ) { response( cache[ term ] ); return; }
                    $.getJSON( "inc/ftsSearchAutocomplete.php", request, function( data, status, xhr ) { cache[ term ] = data; response( data ); });
                }
            });
            /*-------------------------------*/
            $(".viewRec").click(function(){
                var ana = $(this).data('ana');
                var nome = $(this).data('nome');
                var rec = $(this).data('rec');
                $('.zebra tr').removeClass('highLight');
                $(this).parent('tr').addClass('highLight');
                $("#nomeCollezione").text(rec+' record presenti nella collezione: '+nome);
                $("#viewRecDiv").fadeIn('fast');
                $.ajax({
                    url: 'inc/collezioniRec.php',
                    type: 'POST',
                    data: {ana:ana},
                    success: function(data){
                        $('#viewRecTab > tbody').html(data);
                        $('.imgLink').click(function(e){
                            e.preventDefault();
                            $(".imgContent").hide();
                            $('.zebra tr').removeClass('highLight');
                            $(this).parent('td').parent('tr').addClass('highLight');
                            var id = $(this).data('id');
                            //var y = $(this).position().top;
                            var y = $(this).offset();
                            console.log("pos:"+y.top+"/mouse:"+e.pageY);
                            var src = '../foto/'+$(this).data('src');
                            var img = new Image();
                            var w, h;
                            img.src = src;
                            img.onload = function(){
                                w = this.width/2;
                                h = this.height/2;
                                $("#imgContent"+id).css({"top":y,"width":w,"height":h, "background-image":"url("+src+")"}).fadeIn('fast');
                                $('.chiudiThumb').click(function(){
                                    $(this).parent('div').fadeOut('fast');
                                    $('.zebra tr').removeClass('highLight');
                                });
                            };
                        });

                        $(".viewScheda").click(function(e) {
                            var id = $(this).data('id');
                            $("body").append('<form action="scheda_archeo.php" method="post" id="viewScheda"><input type="hidden" name="id" value="' + id + '" /></form>');
                            $("#viewScheda").submit();
                        });
                    }
                });
                $("#viewRecDivHead i").click(function(){
                    $("#viewRecDiv").fadeOut('fast');
                });
            });
            /*-------------------------------*/
        });
    });//mainLink function

 $("#apriLicenze").click(function(){ $("#licenzeWrap").fadeIn('fast'); });
 $("#chiudiLicenze").click(function(){ $("#licenzeWrap").fadeOut('fast'); });


 //$("#policy").hide();
 $('#cookie-policy').click(function () {
  $("#policy").fadeIn('fast');
  $("#chiudiPolicy").click(function(){$("#policy").fadeOut('fast');});
 });
 $('#cookie-accept,#chiudiPolicy').click(function () {
  days = 182; //giorni di validità cookie
  myDate = new Date();
  myDate.setTime(myDate.getTime()+(days*24*60*60*1000));
  document.cookie = "comply_cookie = comply_yes; expires = " + myDate.toGMTString(); //crea cookie: name|value|expiry
  $("#cookies").slideUp("slow");
 });

});

function dinSel(com){
    $.getJSON( "inc/dinSelArea.php", {com:com}, function( data ) {
        var u = eval(data);
        var localita = u.localita;
        var indirizzi = u.indirizzi;
        $('#locSel, #indSel').html('');
        if(localita.length < 1){
            $('#locSel').append($('<option>', { value: 0, text : 'nessuna località per il Comune selezionato'}));
        }else{
            $('#locSel').append($('<option>', { value: 0, text : 'scegli località'}).attr("selected", true));
            $.each(localita, function (key, value) {$('#locSel').append($('<option>', { value: value.idlocalita, text : value.localita })); });
        }
        if(indirizzi.length < 1){
            $('#indSel').append($('<option>', { value: 0, text : 'nessun indirizzo per il Comune selezionato'}));
        }else{
            $('#indSel').append($('<option>', { value: 0, text : 'scegli indirizzo'}).attr("selected", true));
            $.each(indirizzi, function (key, value) { $('#indSel').append($('<option>', { value: value.idind, text : value.indirizzo })); });
        }
    });
}

function mainLink(i){
  $('.mainLink').removeClass('attivo');
  $('#'+i).addClass('attivo');
  //var div = $(this).attr('id');
  $('html, body').stop().animate({scrollTop: $("#main").scrollTop()}, 800);
  $('section#main').load('inc/progettoContent.php #'+i, function(){
   $('section#main').fadeIn('slow');
   $('html, body').stop().animate({scrollTop: $("#main").offset().top-headH-100}, 800);
   $('.removeContent').click(function(){
    $('section#main').fadeOut('slow',function(){$(this).html('')});
    $('html, body').animate({scrollTop: $("#main").scrollTop()}, 800);
    $('.mainLink').removeClass('attivo');
   });
      //pulsanti tipo scheda
   $('input[name="tipoButt"]').on("click",function(){
    var label = $(this).attr('id');
    $("label[for='"+label+"']").toggleClass('labelRadioActive');
   });

   //select dinamica comune
   $("#comSel").on("change", function(){
    var com = $(this).val();
    dinSel(com);
   });

   //slider
   $(function() {
    var tooltip = function(sliderObj, ui){
     val1 = '<span class="sliderTip1">'+ sliderObj.slider("values", 0) +'</span>';
     val2 = '<span class="sliderTip2">'+ sliderObj.slider("values", 1) +'</span>';
     ci=sliderObj.slider("values", 0);
     cf=sliderObj.slider("values", 1);
     sliderObj.children('.ui-slider-handle').first().html(val1);
     sliderObj.children('.ui-slider-handle').last().html(val2);
     $('#ci').val(ci);
     $('#cf').val(cf);
    };
    $( "#slider" ).slider({
     range: true,
     min: 1500,
     max: currentYear,
     values: [ 1500, currentYear ],
     step: 1,
     slide: function( e, ui ){tooltip($(this),ui);},
     create:function(e,ui){tooltip($(this),ui);}
    });
   });
   $('.ui-slider-handle').each(function(){
    $('.ui-slider-handle').first().removeClass('ui-state-default').addClass('ui-state-default1');
    $('.ui-slider-handle').last().removeClass('ui-state-default').addClass('ui-state-default2');
   });


   $("#ftsError").hide();
   //attiva ricerca
   $("#filtroButt").click(function(){
    //var data = new Array();
    var tipo = new Array();
    var fts, ci, cf;

    //valori tipo scheda
    if($("input[name=tipoButt]:checked").length < 1){
     tipo.push(0);
    }else{
     $("input[name=tipoButt]:checked").each(function(){
      var t = $(this).val();
      tipo.push(t);
     });
    }

    //valori area geografica
    var comSel = $("#comSel").val();
    var locSel = $("#locSel").val();
    var indSel = $("#indSel").val();

    //valori full text search
    var fts1 = $('#fts1').val();fts1=fts1.slice(0, -1);fts1=fts1+':*';
    var fts2 = $('#fts2').val();fts2=fts2.slice(0, -1);fts2=fts2+':*';
    var fts3 = $('#fts3').val();fts3=fts3.slice(0, -1);fts3=fts3+':*';
    var op1 = $('#op1').val();
    var op2 = $('#op2').val();
    var ftsError;

    if(fts1 == ':*' && fts2 == ':*' && fts3 == ':*'){vect = 'no';}
    else if(fts2 == ':*' && fts3 == ':*'){vect=fts1;}
    else if(fts2 != ':*' && fts3 == ':*'){
     if(fts1 == ':*'){ $("#ftsError").text('manca la prima parola').fadeIn('fast'); return false;}
     else if(op1=='--'){$("#ftsError").text('manca operatore').fadeIn('fast'); return false;}
     else{ vect=fts1+" "+op1+" "+fts2; $("#ftsError").text('').fadeOut('fast');}
    }
    else if(fts3 != ':*'){
     if(fts1 == ':*' && fts2 == ':*'){ $("#ftsError").text('mancano le prime due parole').fadeIn('fast');  return false;}
     else if(fts1 == ':*'){ $("#ftsError").text('manca la prima parola').fadeIn('fast');  return false;}
     else if(fts2 == ':*'){ $("#ftsError").text('manca la seconda parola').fadeIn('fast');  return false;}
     else if(op1=='--'){$("#ftsError").text('manca primo operatore').fadeIn('fast'); return false;}
     else if(op2 == '--'){$("#ftsError").text('manca secondo operatore').fadeIn('fast'); return false;}
     else{vect=fts1+" "+op1+" "+fts2+" "+op2+" "+fts3;$("#ftsError").text('').fadeOut('fast');}
    }

    //valori cronologia
    ci = $('#ci').val();
    cf = $('#cf').val();

    clearStorage();
    cerca(tipo,comSel,locSel,indSel,vect,ci,cf);
   });

   var cache = {};
   $( ".term" ).autocomplete({
    minLength: 2,
    source: function( request, response ) {
      var term = request.term;
      if ( term in cache ) { response( cache[ term ] ); return; }
      $.getJSON( "inc/ftsSearchAutocomplete.php", request, function( data, status, xhr ) { cache[ term ] = data; response( data ); });
    }
   });
   /*-------------------------------*/
   $(".viewRec").click(function(){
    var ana = $(this).data('ana');
    var nome = $(this).data('nome');
    var rec = $(this).data('rec');
    $('.zebra tr').removeClass('highLight');
    $(this).parent('tr').addClass('highLight');
    $("#nomeCollezione").text(rec+' record presenti nella collezione: '+nome);
    $("#viewRecDiv").fadeIn('fast');
    $.ajax({
     url: 'inc/collezioniRec.php',
     type: 'POST',
     data: {ana:ana},
     success: function(data){
      $('#viewRecTab > tbody').html(data);
      $('.imgLink').click(function(e){
        e.preventDefault();
        $(".imgContent").hide();
        $('.zebra tr').removeClass('highLight');
        $(this).parent('td').parent('tr').addClass('highLight');
        var id = $(this).data('id');console.log("idImg:"+id);
        var y = $(this).position().top;
        var src = '../foto/'+$(this).data('src');
        var img = new Image();
        var w, h;
        img.src = src;
        img.onload = function(){
                w = this.width/2;
                h = this.height/2;
                $("#imgContent"+id)
                .css({"top":y,"width":w,"height":h, "background-image":"url("+src+")"})
                .fadeIn('fast')
                //.click(function(){window.open('scheda_archeo.php?id='+id, '_blank');})
                ;
                $('.chiudiThumb').click(function(){
                        $(this).parent('div').fadeOut('fast');
                        $('.zebra tr').removeClass('highLight');
                });
        };
      });

      $(".viewScheda").click(function(e) {
       var id = $(this).data('id');
       $("body").append('<form action="scheda_archeo.php" method="post" id="viewScheda"><input type="hidden" name="id" value="' + id + '" /></form>');
       $("#viewScheda").submit();
      });
     }
    });
    $("#viewRecDivHead i").click(function(){
     $("#viewRecDiv").fadeOut('fast');
    });
   });
   /*-------------------------------*/
  });
}

function clearStorage(){ sessionStorage.clear(); }
function cerca(tipo,comSel,locSel,indSel,vect,ci,cf){
    $.ajax({
        url: 'risultato_test.php',
        type: 'POST',
        data: {t:tipo,com:comSel,loc:locSel,ind:indSel,fts:vect,ci:ci,cf:cf},
        beforeSend: function() { $("#filtroButt i").removeClass('fa-search').addClass('fa-spinner fa-spin'); },
        success: function(data){
            $('section#main').html(data);
            if(r){
                $('html, body').stop().animate({scrollTop: $("#main").offset().top-headH-100}, 800);
                $('.imgLink').each(function(){if($(this).data('id')== s){$(this).parent('td').parent('tr').addClass('highLight');}});
            }
            $('.imgLink').click(function(e){
                e.preventDefault();
                $(".imgContent").hide();
                $('.zebra tr').removeClass('highLight');
                $(this).parent('td').parent('tr').addClass('highLight');
                var id = $(this).data('id');
                var y = $(this).position().top;
                var src = '../foto/'+$(this).data('src');
                var img = new Image();
                var w, h;
                img.src = src;
                img.onload = function(){
                    w = this.width/2;
                    h = this.height/2;
                    $("#imgContent"+id).css({"top":y,"width":w,"height":h, "background-image":"url("+src+")"}).fadeIn('fast');
                    $('.chiudiThumb').click(function(){
                        $(this).parent('div').fadeOut('fast');
                        $('.zebra tr').removeClass('highLight');
                    });
                };
            });
        }
    });
}

document.getElementById("cookie-accept").onclick = function(e) {
    days = 182;
    myDate = new Date();
    myDate.setTime(myDate.getTime()+(days*24*60*60*1000));
    document.cookie = "comply_cookie = comply_yes; expires = " + myDate.toGMTString();
    document.getElementById("cookies").parentNode.removeChild(elem);
}
