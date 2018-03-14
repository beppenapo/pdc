var headH = $("#head").outerHeight(true);
var windowX =  $( window ).width();
var windowY =  $( window ).height();
var currentYear = (new Date).getFullYear();
//console.log(headH);

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
        $('.mainLink').removeClass('attivo');
        $(this).addClass('attivo');
        div = $(this).data('id');
        if(div){mainLink(div);}
        // $('html, body').stop().animate({scrollTop: $("#main").scrollTop()}, 800);
        // $('section#main').load('inc/progettoContent.php #'+div, function(){
        //     $('section#main').fadeIn('slow');
        //     $('html, body').stop().animate({scrollTop: $("#main").offset().top-headH-100}, 800);
        //     $('.removeContent').click(function(){
        //         $('section#main').fadeOut('slow',function(){$(this).html('')});
        //         $('html, body').animate({scrollTop: $("#main").scrollTop()}, 800);
        //         $('.mainLink').removeClass('attivo');
        //     });
        //     //pulsanti tipo scheda
        //     $('input[name="tipoButt"]').on("click",function(){
        //         var label = $(this).attr('id');
        //         $("label[for='"+label+"']").toggleClass('labelRadioActive');
        //     });
        //
        //     $('input[name="tipoProg"]').on("click",function(){
        //         var label = $(this).attr('id');
        //         $('input[name="tipoProg"]').parent('label').toggleClass('labelCheckActive');
        //     });
        //
        //     //select dinamica comune
        //     $("#comSel").on("change", function(){
        //         var com = $(this).val();
        //         dinSel(com);
        //     });
        //
        //     //slider
        //     $(function() {
        //         var tooltip = function(sliderObj, ui){
        //             val1 = '<span class="sliderTip1">'+ sliderObj.slider("values", 0) +'</span>';
        //             val2 = '<span class="sliderTip2">'+ sliderObj.slider("values", 1) +'</span>';
        //             ci=sliderObj.slider("values", 0);
        //             cf=sliderObj.slider("values", 1);
        //             sliderObj.children('.ui-slider-handle').first().html(val1);
        //             sliderObj.children('.ui-slider-handle').last().html(val2);
        //             $('#ci').val(ci);
        //             $('#cf').val(cf);
        //         };
        //         $( "#slider" ).slider({
        //             range: true,
        //             min: 1500,
        //             max: currentYear,
        //             values: [ 1500, currentYear ],
        //             step: 1,
        //             slide: function( e, ui ){tooltip($(this),ui);},
        //             create:function(e,ui){tooltip($(this),ui);}
        //         });
        //     });
        //     $('.ui-slider-handle').each(function(){
        //         $('.ui-slider-handle').first().removeClass('ui-state-default').addClass('ui-state-default1');
        //         $('.ui-slider-handle').last().removeClass('ui-state-default').addClass('ui-state-default2');
        //     });
        //
        //     $("#ftsError").hide();
        //     //attiva ricerca
        //     $("#filtroButt").click(function(){
        //         var tipo = new Array();
        //         var progetto, fts, ci, cf;
        //
        //         //valori tipo scheda
        //         if($("input[name=tipoButt]:checked").length < 1){
        //             tipo.push(0);
        //         }else{
        //             $("input[name=tipoButt]:checked").each(function(){
        //                 var t = $(this).val();
        //                 tipo.push(t);
        //             });
        //         }
        //
        //         //valori progetto
        //         progetto = $("input[name='tipoProg']:checked").val();
        //
        //         //valori area geografica
        //         var comSel = $("#comSel").val();
        //         var locSel = $("#locSel").val();
        //         var indSel = $("#indSel").val();
        //
        //         //valori full text search
        //         var fts1 = $('#fts1').val();fts1=fts1.slice(0, -1);fts1=fts1+':*';
        //         var fts2 = $('#fts2').val();fts2=fts2.slice(0, -1);fts2=fts2+':*';
        //         var fts3 = $('#fts3').val();fts3=fts3.slice(0, -1);fts3=fts3+':*';
        //         var op1 = $('#op1').val();
        //         var op2 = $('#op2').val();
        //         var ftsError;
        //
        //         if(fts1 == ':*' && fts2 == ':*' && fts3 == ':*'){vect = 'no';}
        //         else if(fts2 == ':*' && fts3 == ':*'){vect=fts1;}
        //         else if(fts2 != ':*' && fts3 == ':*'){
        //             if(fts1 == ':*'){ $("#ftsError").text('manca la prima parola').fadeIn('fast'); return false;}
        //             else if(op1=='--'){$("#ftsError").text('manca operatore').fadeIn('fast'); return false;}
        //             else{ vect=fts1+" "+op1+" "+fts2; $("#ftsError").text('').fadeOut('fast');}
        //         }
        //         else if(fts3 != ':*'){
        //             if(fts1 == ':*' && fts2 == ':*'){ $("#ftsError").text('mancano le prime due parole').fadeIn('fast');  return false;}
        //             else if(fts1 == ':*'){ $("#ftsError").text('manca la prima parola').fadeIn('fast');  return false;}
        //             else if(fts2 == ':*'){ $("#ftsError").text('manca la seconda parola').fadeIn('fast');  return false;}
        //             else if(op1=='--'){$("#ftsError").text('manca primo operatore').fadeIn('fast'); return false;}
        //             else if(op2 == '--'){$("#ftsError").text('manca secondo operatore').fadeIn('fast'); return false;}
        //             else{vect=fts1+" "+op1+" "+fts2+" "+op2+" "+fts3;$("#ftsError").text('').fadeOut('fast');}
        //         }
        //
        //         //valori cronologia
        //         ci = $('#ci').val();
        //         cf = $('#cf').val();
        //
        //         cerca(tipo,progetto,comSel,locSel,indSel,vect,ci,cf);
        //     });
        //
        //     var cache = {};
        //     $( ".term" ).autocomplete({
        //         minLength: 2,
        //         source: function( request, response ) {
        //             var term = request.term;
        //             if ( term in cache ) { response( cache[ term ] ); return; }
        //             $.getJSON( "inc/ftsSearchAutocomplete.php", request, function( data, status, xhr ) { cache[ term ] = data; response( data ); });
        //         }
        //     });
        //     /*-------------------------------*/
        //     $(".viewRec").click(function(){
        //         var ana = $(this).data('ana');
        //         var nome = $(this).data('nome');
        //         var rec = $(this).data('rec');
        //         $('.zebra tr').removeClass('highLight');
        //         $(this).parent('tr').addClass('highLight');
        //         $("#nomeCollezione").text(rec+' record presenti nella collezione: '+nome);
        //         $("#viewRecDiv").fadeIn('fast');
        //         $.ajax({
        //             url: 'inc/collezioniRec.php',
        //             type: 'POST',
        //             data: {ana:ana},
        //             success: function(data){
        //                 $('#viewRecTab > tbody').html(data);
        //
        //                 $('.imgLink').click(function(e){
        //                     e.preventDefault();
        //                     $(".imgContent").hide();
        //                     $('.zebra tr').removeClass('highLight');
        //                     $(this).parent('td').parent('tr').addClass('highLight');
        //                     var id = $(this).data('id');
        //                     //var y = $(this).position().top;
        //                     var y = $(this).offset();
        //                     console.log("pos:"+y.top+"/mouse:"+e.pageY);
        //                     var src = '../foto/'+$(this).data('src');
        //                     var img = new Image();
        //                     var w, h;
        //                     img.src = src;
        //                     img.onload = function(){
        //                         w = this.width/2;
        //                         h = this.height/2;
        //                         $("#imgContent"+id).css({"top":y,"width":w,"height":h, "background-image":"url("+src+")"}).fadeIn('fast');
        //                         $('.chiudiThumb').click(function(){
        //                             $(this).parent('div').fadeOut('fast');
        //                             $('.zebra tr').removeClass('highLight');
        //                         });
        //                     };
        //                 });
        //
        //                 $(".viewScheda").click(function(e) {
        //                     var id = $(this).data('id');
        //                     $("body").append('<form action="scheda_archeo.php" method="post" id="viewScheda"><input type="hidden" name="id" value="' + id + '" /></form>');
        //                     $("#viewScheda").submit();
        //                 });
        //             }
        //         });
        //         $("#viewRecDivHead i").click(function(){ $("#viewRecDiv").fadeOut('fast'); });
        //     });
        // });
    });

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
    loc = $("#locSel");
    ind = $("#indSel");
    loc.html('');
    ind.html('');
    $.ajax({
        url:'class/main.connector.php',
        type:'POST',
        data:{func:'dinSel',com:com},
        dataType:'json',
        success: function(data){
            locArr = data['localita'];
            indArr = data['indirizzi'];
            if (locArr.length>0) {
                $("<option/>",{value:0,text:'scegli località'}).appendTo(loc);
                $.each(locArr, function(k,v){
                    $("<option/>",{value:v.id,text:v.localita}).appendTo(loc);
                });
            }else {
                $('<option>', { value: 0, text : 'nessuna località disponibile per il Comune selezionato'}).appendTo(loc);
            }
            if (indArr.length>0) {
                $("<option/>",{value:0,text:'scegli indirizzo'}).appendTo(loc);
                $.each(indArr, function(k,v){
                    $("<option/>",{value:v.id,text:v.indirizzo+" "+v.cap}).appendTo(ind);
                });
            }else {
                $('<option>', { value: 0, text : 'nessun indirizzo disponibile per il Comune selezionato'}).appendTo(ind);
            }
        }
    });
}

function scrollUp(){$('html, body').stop().animate({scrollTop: $("#main").offset().top-headH-100}, 800);}
function scrollDown(){$('html, body').stop().animate({scrollTop: $("#main").scrollTop()}, 800);}

function mainLink(i){
    scrollDown();
    $('section#main').load('inc/progettoContent.php #'+i, function(){
        $('section#main').fadeIn('slow');
        scrollUp();

        $('.removeContent').click(function(){
            $('section#main').fadeOut('slow',function(){$(this).html('')});
            scrollDown();
            $('.mainLink').removeClass('attivo');
        });

        //pulsanti tipo scheda
        $('input[name="tipoButt"]').on("click",function(){
            var label = $(this).attr('id');
            $("label[for='"+label+"']").toggleClass('labelRadioActive');
        });

        $('input[name="tipoProg"]').on("click",function(){
            $('input[name="tipoProg"]').parent('label').toggleClass('labelCheckActive');
        });

        //select dinamica comune
        $("#comSel").on("change", function(){ dinSel($(this).val()); });

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
            var tipo = new Array();
            var progetto, fts, ci, cf;
            //valori tipo scheda
            if($("input[name=tipoButt]:checked").length < 1){
                tipo.push(0);
            }else{
                $("input[name=tipoButt]:checked").each(function(){
                    var t = $(this).val();
                    tipo.push(t);
                });
            }

            //valori progetto
            progetto = $("input[name='tipoProg']:checked").val();

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
            cerca(tipo, progetto, comSel,locSel,indSel,vect,ci,cf);
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
            ana = $(this).data('ana');
            nome = $(this).data('nome');
            rec = $(this).data('rec');
            $('.zebra tr').removeClass('highLight');
            $(this).parent('tr').addClass('highLight');
            $("#viewRecDivHead>h3").html(nome);
            $("#viewRecDivHead>p>span").text(rec);
            $("#viewRecDiv").fadeIn('fast');
            tbody = $('#viewRecTab > tbody');
            $.ajax({
                url:'class/main.connector.php',
                type:'POST',
                data:{func:'listaSchedeCollezione',id:ana},
                dataType:'json',
                success: function(data){
                    $.each(data, function(k,v){
                        oggetto = v.dgn_dnogg.replace(/\\/g, "");
                        icoImg = $("<i/>",{class:'fa fa-picture-o'});
                        icoUrl = $("<i/>",{class:'fa fa-external-link-square'});
                        viewImg = !v.path ? '' : $("<a/>",{href:'#',class:'imgLink', title:'Visualizza anteprima immagine'}).html(icoImg).on('click', function(e){
                            e.preventDefault();
                            $(".imgContent").hide();
                            $('.zebra tr').removeClass('highLight');
                            $(this).parent('td').parent('tr').addClass('highLight');
                            y = $(this).position().top;
                            img = new Image();
                            var w, h;
                            img.src = "foto/"+v.path;
                            img.onload = function(){
                                w = this.width/2;
                                h = this.height/2;
                                $("#imgContent")
                                    .css({"width":w,"height":h, "left":"calc((100% - "+w+"px)/2)", "background-image":"url(foto/"+v.path+")"})
                                    .fadeIn('fast');
                                $('.chiudiThumb').click(function(){
                                    $(this).parent('div').fadeOut('fast');
                                    $('.zebra tr').removeClass('highLight');
                                });
                            };
                        });
                        link = $("<a/>", {href:'#',class:'viewScheda', title:'Visualizza scheda monografica record'}).html(icoUrl).on('click',function(){
                            $("body").append('<form action="scheda_archeo.php" method="post" id="viewScheda"><input type="hidden" name="id" value="' + v.id + '" /></form>');
                            $("#viewScheda").submit();
                        });
                        tr = $("<tr/>").appendTo(tbody);
                        $("<td/>",{text:v.dgn_numsch}).appendTo(tr);
                        $("<td/>",{text:oggetto}).appendTo(tr);
                        $("<td/>",{text:v.cro_spec}).appendTo(tr);
                        $("<td/>").html(viewImg).appendTo(tr);
                        $("<td/>").html(link).appendTo(tr);
                    });
                }
            });
            // $.ajax({
            //     url: 'inc/collezioniRec.php',
            //     type: 'POST',
            //     data: {ana:ana},
            //     success: function(data){
            //         $('#viewRecTab > tbody').html(data);
            //         $('.imgLink').click(function(e){
            //             e.preventDefault();
            //             $(".imgContent").hide();
            //             $('.zebra tr').removeClass('highLight');
            //             $(this).parent('td').parent('tr').addClass('highLight');
            //             var id = $(this).data('id');
            //             // console.log("idImg:"+id);
            //             var y = $(this).position().top;
            //             var src = 'foto/'+$(this).data('src');
            //             var img = new Image();
            //             var w, h;
            //             img.src = src;
            //             img.onload = function(){
            //                 w = this.width/2;
            //                 h = this.height/2;
            //                 $("#imgContent"+id)
            //                 .css({"top":y,"width":w,"height":h, "background-image":"url("+src+")"})
            //                 .fadeIn('fast')
            //                 ;
            //                 $('.chiudiThumb').click(function(){
            //                     $(this).parent('div').fadeOut('fast');
            //                     $('.zebra tr').removeClass('highLight');
            //                 });
            //             };
            //         });
            //
            //         $(".viewScheda").click(function(e) {
            //             var id = $(this).data('id');
            //             $("body").append('<form action="scheda_archeo.php" method="post" id="viewScheda"><input type="hidden" name="id" value="' + id + '" /></form>');
            //             $("#viewScheda").submit();
            //         });
            //     }
            // });
            $(".closeModal").click(function(){
                $("#viewRecDiv").fadeOut('fast');
                $('.zebra tr').removeClass('highLight');
            });
        });
    });
}

function clearStorage(){ sessionStorage.clear(); }
function cerca(tipo,progetto,comSel,locSel,indSel,vect,ci,cf){
    $.ajax({
        url: 'risultato.php',
        type: 'POST',
        data: {t:tipo,progetto:progetto,com:comSel,loc:locSel,ind:indSel,fts:vect,ci:ci,cf:cf},
        beforeSend: function() { $("#filtroButt i").removeClass('fa-search').addClass('fa-spinner fa-spin'); },
        success: function(data){
            $('section#main').html(data);
            if(r){
                scrollUp();
                $('.imgLink').each(function(){if($(this).data('id')== s){$(this).parent('td').parent('tr').addClass('highLight');}});
            }
            $('.imgLink').click(function(e){
                e.preventDefault();
                $(".imgContent").hide();
                $('.zebra tr').removeClass('highLight');
                $(this).parent('td').parent('tr').addClass('highLight');
                var id = $(this).data('id');
                var y = $(this).position().top;
                var src = 'foto/'+$(this).data('src');
                var img = new Image();
                var w, h;
                img.src = src;
                img.onload = function(){
                    w = this.width/2;
                    h = this.height/2;
                    $("#imgContent")
                        .css({"width":w,"height":h, "left":"calc((100% - "+w+"px)/2)", "background-image":"url("+src+")"})
                        .fadeIn('fast');
                    $('.chiudiThumb').click(function(){
                        $(this).parent('div').fadeOut('fast');
                        $('.zebra tr').removeClass('highLight');
                    });
                };
            });
        }
    });
}

// document.getElementById("cookie-accept").onclick = function(e) {
//     days = 182;
//     myDate = new Date();
//     myDate.setTime(myDate.getTime()+(days*24*60*60*1000));
//     document.cookie = "comply_cookie = comply_yes; expires = " + myDate.toGMTString();
//     document.getElementById("cookies").parentNode.removeChild(elem);
// }
