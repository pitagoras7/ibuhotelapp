$(document).ready(function() {

    $('.carousel.carousel-slider').carousel({
        fullWidth: true
    });

});



us = jQuery.parseJSON(sessionStorage.getItem("user"));
$('#name__').text(us.firstname + ' ' + us.lastname);
$('#email__').text(us.email);
$('#avatar__').attr("src", us.avatar);

sessionStorage.setItem("urlAjax", "http://localhost/API/masters.php/1");


var servicios = [{
    "name": "pedro",
    "cedula": "17727533"
}];


create_menu();
create_notification();
create_datatableGuest();

var service         = new Array();
var serviceId       = "";
service.detalle     = new Array();




service.guest_id    = "2";
service.guest_name  = "pedro rojas";
service.order_type   = "2";
service.mesa_id     = "0";
service.description = "roomservice Hotel Altamira";
service.estatu      = "ACTIVE";
service.subtotal    = "";
service.total       = "";
service.exento      = "";
service.tax         = "";

var recibo          = "";


function filter_datatable() {
    create_datatableGuest();
}


function create_menu() {

    $.ajax({
        method: "GET",
        url: "http://localhost/API/menu_lateral.php/1",
        dataType: "json"
    })
    .done(function(result) {
        var menu = "";
        $.each(result, function(i, n) {
            menu = menu + "<li class=\"no-padding\"><a class=\"waves-effect waves-grey\" href=\"" + n.href + "\">" + n.name + "</a></li>";
        });
        $('#menu').append(menu);
    });

}


function create_notification() {


    $("#notification__ .noti").remove();


    $.ajax({
        method: "GET",
        url: "http://localhost/API/notifications.php/1",
        dataType: "json"
    })
    .done(function(result) {
        var menu = "";
        $.each(result, function(i, n) {
            menu = menu + " <li class='noti'><a href=\"" + n.href + "\"><div class=\"notification\"><div class=\"notification-icon circle " + n.color + "\"> <i class=\"material-icons\">" + n.icon + "</i></div><div class=\"notification-text\"><p><b>" + n.emisor + "</b><br> " + n.name + "</p><span>" + n.created_at + "</span></div></div></a></li>";
        });

        $('#notification__').append(menu);

    });

}



function create_datatableGuest() {

    $('#tableGuest table').remove();
    $('#tableGuest #datatableGuest___filter').remove();
    $('#tableGuest #datatableGuest___info').remove();

    $("#tableGuest").append("<table id=\"datatableGuest__\" class=\"display responsive-table datatable-example\"><thead><tr><th>Nombre</th><th>Telefono</th><th>Idioma</th><th></th></tr></thead><tbody class=\"tbodydata\" ></tbody></table>");


    $.ajax({
        method: "GET",
        url: "http://localhost/API/Guest.php/1/ocupacion",
        dataType: "json"
    })
    .done(function(result) {

        $('#datatableGuest__ td').remove();

        var row = "";
        $.each(result, function(i, n) {
            row = row + "<tr><td> " + n.firstname + "</td><td> " + n.telephone + "</td><td>" + n.level + "</td><td style='width:100px'><a onclick=\"updateGuest(" + n.id + ")\" class=\"btn btn-small waves-effect waves-light blue\"><i class=\"material-icons\">edit</i></a></td></tr>";
        });

        $('#datatableGuest__ tbody').append(row);


        datatableGuest_load();
        $('#tableGuest #datatableGuest___filter').remove();
        $('#tableGuest #datatableGuest___info').remove();
    });
}


function datatableGuest_load() {


    datatablex = $('#datatableGuest__').DataTable({
        paging: false,
        language: {
            searchPlaceholder: 'Search records',
            sSearch: '',
            sLengthMenu: 'Show _MENU_',
            sLength: 'dataTables_length',
            oPaginate: {
                sFirst: '<i class="material-icons">chevron_left</i>',
                sPrevious: '<i class="material-icons">chevron_left</i>',
                sNext: '<i class="material-icons">chevron_right</i>',
                sLast: '<i class="material-icons">chevron_right</i>'
            }
        }
    });

    $('.dataTables_length select').addClass('browser-default');
}


function deleteMaster(id) {
    $.ajax({
        method: "GET",
        url: "http://localhost/API/masters.php/1/" + id,
        dataType: "json"
    })
    .done(function(result) {
        var row = "";
        $.each(result, function(i, n) {
            $('#formDeleteMaster #inputs input').remove();
            $("#formDeleteMaster #inputs").append("<input name='id'  value='" + n.id + "'   type='hidden' >");
            $('#modalDeleteMaster').modal('open');

        });
    });
}

function deleteMasterConfirm() {


    $.ajax({
        method: "DELETE",
        url: "http://localhost/API/masters.php/1/" + $("#formDeleteMaster #id").val(),
        data: $("#formDeleteMaster").serialize()

    })
    .done(function(msg) {

        $('#modalDeleteMaster').modal('close');
        Materialize.toast(' Eliminación Completada', 4000);
        create_datatableMaster();

    });
}


function findDisponibilidad() {

    desde = $("#desde").val();
    hasta = $("#hasta").val();

    $.ajax({
        method: "GET",
        url: "http://localhost/API/Locations.php/1/disponibilidad/" + desde + "/" + hasta,
        dataType: "json"
    })
    .done(function(result) {

        $("#tableDisponibilidad div").remove();
        $.each(result, function(i, n) {

            $("#tableDisponibilidad").append("<div  class='col m2 s6'><div onclick='newDisponiblidad(" + n.id + ")' style='width:100%; height:50px; line-height:1.4em; padding:10px' class=' btn btn-small waves-effect waves-light " + n.location_subtype_fk.color + " ' >" + n.name + " <br> " + n.location_subtype_fk.name + " </div></div>");

        });

    });

}


function newDisponiblidad(id) {


    $.ajax({
        method: "GET",
        url: "http://localhost/API/Locations.php/1/consultaDisponibilidad/" + id,
        dataType: "json"
    })
    .done(function(result) {

        $.each(result, function(i, n) {

            $('#modalCreateDisponibilidad #habitacion_name ').text(n.name);
            $('#modalCreateDisponibilidad #habitacion_icon ').text(n.icon);
            $('#modalCreateDisponibilidad #habitacion_type ').text(n.location_type_fk.name);
            $('#modalCreateDisponibilidad #habitacion_subtype ').text(n.location_subtype_fk.name);

            $('#modalCreateDisponibilidad #habitacion_avatar ').attr("src", n.location_subtype_fk.avatar);

        });

        $('#modalCreateDisponibilidad').modal('open');




    });
}


function updateMaster(id) {
    $.ajax({
        method: "GET",
        url: "http://localhost/API/masters.php/1/" + id,
        dataType: "json"
    })
    .done(function(result) {
        var row = "";

        $.each(result, function(i, n) {

            $("#formUpdateMaster #name").val(n.name);
            $("#formUpdateMaster #color").val(n.color);
            $("#formUpdateMaster #icon").val(n.icon);
            $("#formUpdateMaster #longname").val(n.longname);
            $("#formUpdateMaster #inputs").append("<input name='id'  value='" + n.id + "'   type='hidden' >");
            $('#modalUpdateMaster').modal('open');

        });
    });
}

function updateMasterConfirm() {

    $.ajax({
        method: "PUT",
        url: "http://localhost/API/masters.php/1/" + $("#formUpdateMaster #id").val(),
        data: $("#formUpdateMaster").serialize()
    })
    .done(function(msg) {
        $('#modalUpdateMaster').modal('close');
        Materialize.toast('Edition completed!', 4000);
        create_datatableMaster();
    });
}

function newMaster(id) {


    $('#modalCreateMaster').modal('open');

}

function newMasterConfirm() {


    $.ajax({
        method: "POST",
        url: "http://localhost/API/masters.php/1/",
        data: $("#formCreateMaster").serialize()
    })
    .done(function(msg) {
        $('#modalCreateMaster').modal('close');
        Materialize.toast('Nuevo Registro', 4000);
        create_datatableMaster();
    });

}


function newGuest() {


    $('#modalCreateGuest').modal('open');
}


function newGuestConfirm() {


    $.ajax({
        method: "POST",
        url: "http://localhost/API/masters.php/1/",
        data: $("#formCreateMaster").serialize()
    })
    .done(function(msg) {
        $('#modalCreateMaster').modal('close');
        Materialize.toast('Nuevo Registro', 4000);
        create_datatableMaster();
    });
}



function newServiceId(i) {
    serviceId = i;
    lcd();
    SelectServiceId();
}


function SelectServiceId() {
    i = serviceId;
    $("#rowRecibo" + i).css('background', 'yellow');
    $("#rowRecibo" + i).css('border', '2px solid red');
}




function quantyService(x) {


    if (x == 1) {
        window.service.detalle[serviceId].cantidad = window.service.detalle[serviceId].cantidad + 1;
    }


    if (x == 0) {
        window.service.detalle[serviceId].cantidad = window.service.detalle[serviceId].cantidad - 1;
    }


    if (x == 2) {
        window.service.detalle[serviceId].estatu = false;
    }


    if (x == 3) {


        $.ajax({
            method: "GET",
            url: "http://localhost/API/extras.php/1/service/1",
            dataType: "json"
        })
        .done(function(msg) {

            modo('extra');

            $("#dashboard_service #extra div").remove();

            $.each(msg, function(i, n) {


                $("#dashboard_service #extra ").append("<div onclick=\"add_extra('" + n.id + "','" + n.name + "','" + n.subtotal + "','" + n.total + "','" + n.tax + "')\" class='input-field col m2 s12'><div class='card' style='overflow: hidden; height:150px'><div class='card-content'><span class='card-title activator'>" +
                    n.name + "</span>  </div></div></div>");

            });


        });

    }

    lcd();
}


function modo(x) {


    if (x == 'service') {

        $("#dashboard_service #extra ").hide();
        $("#nav_extra ").hide();
        $("#nav_service ").show();
        $("#dashboard_service #panel ").show();

    }

    if (x == 'extra') {

        $("#dashboard_service #extra ").show();
        $("#nav_extra ").show();
        $("#nav_service ").hide();
        $("#dashboard_service #panel ").hide();


    }



}



function add_extra(id, name, subtotal,total,tax) {

    var extr = new Array();
    extr.codigo         = id;
    extr.nombre         = name;
    extr.subtotal       = subtotal;
    extr.total          = total;
    extr.tax            = tax;
    extr.quanty         = 1;
    extr.exento         = "false";
    extr.estatu         = true;
    window.service.detalle[serviceId].extras.push(extr);
    lcd();
}



function add_service(i) {
    var serviceLocal = jQuery.parseJSON(sessionStorage.getItem("service"));
    var serv = new Array();
    serv.codigo         = serviceLocal[i].id;
    serv.nombre         = serviceLocal[i].name;
    serv.total          = serviceLocal[i].total;
    serv.subtotal       = serviceLocal[i].subtotal;
    serv.tax            = serviceLocal[i].tax;
    serv.exento         = serviceLocal[i].exento;
    serv.estatu         = true;
    serv.cantidad       = 1;
    serv.observation    = "No especifica";
    serv.caja_id        = 0;
    serv.extras         = new Array();
    serv.supplies       = new Array();
    serviceId           = window.service.detalle.length;
    window.service.detalle.push(serv);
    lcd();
}







function calculos() {

    var subtotal = 0;
    var tax = 0;
    var exento = 0;
    var total = 0;
    var total_extra = 0;

    $.each(window.service.detalle, function(i, detalle) {


        if (detalle.estatu == true) {

            subtotal = parseFloat(parseFloat(detalle.subtotal) * detalle.cantidad) + parseFloat(subtotal);
            tax = ( parseFloat(detalle.tax)* detalle.cantidad )  + parseFloat(tax);


            if (detalle.exento == "true") {
                exento = ( parseFloat(detalle.subtotal) * detalle.cantidad ) + parseFloat(exento);
            }



            $.each(detalle.extras, function(z, extra) {

             subtotal =  ( parseFloat(extra.subtotal) * detalle.cantidad ) + subtotal;
             tax      =  ( parseFloat(extra.tax) * detalle.cantidad ) + tax;

         });


        }



    });



    total = subtotal + tax;
    total = total + total_extra;
    service.total = total.toFixed(2);
    service.tax = tax.toFixed(2);
    service.subtotal = subtotal.toFixed(2);
    service.exento = exento.toFixed(2);



}



function lcd() {
    var html_recibo = "";
    var html_extra = "";
    calculos();
    $("#dashboard_service #recibo #lcd div").remove();
    for (var i = 0; i < window.service.detalle.length; i++) {

        if (window.service.detalle[i].estatu == true) {

            for (var x = 0; x < window.service.detalle[i].extras.length; x++) {

                html_extra += "<div class='col m8' >" + window.service.detalle[i].extras[x].nombre + "</div><div class='col m4  right-align' > " + (window.service.detalle[i].extras[x].subtotal)*(window.service.detalle[i].cantidad) + "</div>";
            }

            html_recibo += "<div  id='rowRecibo" + i + "'  class='col m12' onclick='newServiceId(" + i + ")' ><div class='col m8 '>" + window.service.detalle[i].cantidad + " " + window.service.detalle[i].nombre + "</div><div class='col m4 right-align' >" + (window.service.detalle[i].subtotal) * (window.service.detalle[i].cantidad) + "</div>" + html_extra + "</div>";
            html_extra = "";
        }
    }

    html_recibo += "<div class='col m12'><div class='col m6 '>Exento</div><div class='col m6 right-align' >" + service.exento + "</div></div>";
    html_recibo += "<div class='col m12'><div class='col m6 '>Sub Total</div><div class='col m6 right-align' >" + service.subtotal + "</div></div>";
    html_recibo += "<div class='col m12'><div class='col m6 '>Tax</div><div class='col m6 right-align' >" + service.tax + "</div></div>";
    html_recibo += "<div class='col m12'><div class='col m6 '>Total</div><div class='col m6 right-align' >" + service.total + "</div></div>";


    $("#dashboard_service #recibo #lcd").append(html_recibo);
    SelectServiceId();
    analice();
}




function newRoomservice() {

    $.ajax({
        method: "GET",
        url: "http://localhost/API/service.php/1/roomservice",
        dataType: "json"
    })
    .done(function(result) {
        $("#dashboard_general").css('display', 'none');
        $("#nav_service").css('display', 'block');

        $("#dashboard_service #panel div").remove();

        sessionStorage.setItem("service", JSON.stringify(result));


        var serviceLocal = jQuery.parseJSON(sessionStorage.getItem("service"));

            //console.log(serviceLocal[1].name);




            $.each(result, function(i, n) {


                $("#dashboard_service #panel ").append("<div onclick=\"add_service(" + i + ")\" class='input-field col m2 s12'><div class='card' style='overflow: hidden; height:150px'><div class='card-image waves-effect waves-block waves-light'><img class='activator' src='" +
                    serviceLocal[i].avatar1 + "' alt='></div><div class='card-content'><span class='card-title activator'>" +
                    serviceLocal[i].name + "</span></div><div class='card-reveal' style='display: none; transform: translateY(0px);'><span class='card-title'>" +
                    serviceLocal[i].name + "<i class='material-icons right'>close</i></span><p></p></div></div></div>");

            });

        });


    //$('#modalCreateRoomservice').modal('open');

}

function analice() {




        var jsn = "";
        jsn += "{";
        jsn += "\"detalle\":[";
        for (var i = 0; i < service.detalle.length; i++) {
            jsn += "{";
            jsn += "\"service_id\":\"" + service.detalle[i].codigo + "\",";
            jsn += "\"quanty\":\"" + service.detalle[i].cantidad + "\",";
            jsn += "\"estatu\":\"ACTIVE\",";
            jsn += "\"total\":\"" + service.detalle[i].total + "\",";
            jsn += "\"observation\":\"" + service.detalle[i].observation + "\",";
            jsn += "\"subtotal\":\"" + service.detalle[i].subtotal + "\",";
            jsn += "\"tax\":\"" + service.detalle[i].tax + "\",";
            jsn += "\"exento\":\"" + service.detalle[i].exento + "\",";
            jsn += "\"caja_id\":\"" + service.detalle[i].caja_id + "\"";

            if (service.detalle[i].extras.length > 0) {

                jsn += ",\"extras\":[";
                for (var z = 0; z < service.detalle[i].extras.length; z++) {
             

                    jsn += "{";
                    jsn += "\"id\":\"" + service.detalle[i].extras[z].codigo + "\",";
                    jsn += "\"nombre\":\"" + service.detalle[i].extras[z].nombre + "\",";
                    jsn += "\"estatu\":\"" + service.detalle[i].extras[z].estatu + "\",";
                    jsn += "\"total\":\"" + service.detalle[i].extras[z].total + "\",";
                    jsn += "\"subtotal\":\"" + service.detalle[i].extras[z].subtotal + "\",";
                    jsn += "\"tax\":\"" + service.detalle[i].extras[z].tax + "\",";
                    jsn += "\"exento\":\"" + service.detalle[i].extras[z].exento + "\",";
                    jsn += "\"quanty\":\"" + service.detalle[i].extras[z].quanty + "\"";

                    if ((service.detalle[i].extras.length - 1) == z) {
                        jsn += "}]";
                    } else {
                        jsn += "},";
                    }
                }
            }

            if ((service.detalle.length - 1) == i) {
                jsn += "}";
            } else {
                jsn += "},";
            }
        }


        jsn += "],";
        jsn += "\"guest_id\":\"" + service.guest_id + "\",";
        jsn += "\"guest_name\":\"" + service.guest_name + "\",";
        jsn += "\"order_type\":\"" + service.order_type + "\",";
        jsn += "\"mesa_id\":\"" + service.mesa_id + "\",";
        jsn += "\"description\":\"" + service.description + "\",";
        jsn += "\"estatu\":\"" + service.estatu + "\"";
        jsn += "}";

        recibo = jQuery.parseJSON(jsn);
        sessionStorage.setItem("order",jsn);

    }

    /* ENVIO DE UNA ORDEN SERVICIO AL SERVIDOR */

    function newOrderConfirm() {


        analice();

        $.ajax({
            method: "POST",
            url: "http://localhost/API/order.php/1/",
            data: recibo
        })
        .done(function(msg) {

            console.log(msg);

        });

    }