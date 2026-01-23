var GLO = {};

window.onresize = resize;


dhtmlxEvent(window, "load", function () {
    init();
});

function init() {
    window.dhx4.skin = 'material';

    var main_layout = new dhtmlXLayoutObject(document.body, '2E');

    var main_a = main_layout.cells('a');
    main_a.setHeight('80');
    main_a.hideHeader();
    main_a.fixSize(0, 1);
    //main_a.attachHTMLString('');
    main_a.attachObject('frm1');


    ///TABS
    //var main_b = main_layout.cells('b');
    //main_b.hideHeader();
    //main_b.setHeight('20');
    //main_b.fixSize(0, 1);
    //main_b.attachObject('frm1_1');

    var main_c = main_layout.cells('b');
    var layout_Content = main_c.attachLayout('2E');
    var b_cell_a = layout_Content.cells('a');
    b_cell_a.hideHeader();
    b_cell_a.setHeight('30');
    b_cell_a.fixSize(0, 1);
    b_cell_a.attachObject('frm2');

    var main_grid = layout_Content.cells('b');
    main_grid.setText('');
    main_grid.hideHeader();
    GLO.grid_Procesos = main_grid.attachGrid();

    //GetColTitles();

    //initforeignfile();

    Configura_gridProcesos();

    UTILS.getDom("frm1").style.visibility = "visible";
    //UTILS.getDom("frm1_1").style.visibility = "visible";
    UTILS.getDom("frm2").style.visibility = "visible";
    document.getElementsByClassName("dhx_cell_hdr")[2].style.border = "none";
    document.getElementsByClassName("dhx_cell_cont_layout")[2].style.border = "none";
    //document.getElementsByClassName("dhx_cell_hdr")[4].style.border = "none";
    //document.getElementsByClassName("dhx_cell_cont_layout")[4].style.border = "none";
    document.getElementsByClassName("gridbox")[0].style.width = "100%";
    document.getElementsByClassName("gridbox")[0].style.border = "2px solid #DFDFDF";
    document.getElementsByClassName("xhdr")[0].style.borderBottom = "2px solid #DFDFDF";
    document.getElementsByClassName("dhx_cell_hdr")[3].style.border = "none";
    document.getElementsByClassName("dhx_cell_cont_layout")[3].style.border = "none";
}

function GetColTitles() {
    UTILS.Ajax(URL_GetTitles, "",
        function (result) {
            GLO.Titles = JSON.parse(result.data);
            Configura_grid_Procesos();
        },
        function (result) {
            UTILS.OnError(result);
        }
    );
}


function Configura_gridProcesos() {
    var header = "";

    GLO.grid_Procesos.setColumnIds("");
    //c0c0c0
    GLO.grid_Procesos.setStyle(
        "text-align: left; vertical-align: bottom; color: #737373; background-color: #FFF; border: none; padding-left: 4px; font-size: 11px;  line-height: 150%; font-weight: bold",
        "color: #232323; font-size: 12px; line-height: 150%; border: none; height: 62px; padding-top: 12px",
        ""
    );
    GLO.grid_Procesos.setHeader(
        [
            '<div class="divg1"><div class="divg2"><span title="Documento número">○ Doc num <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="">○ SubDoc y DocPadre</span></div></div>',
            '#cspan',
            '<img src="' + iUrl + '/paper_clip.svg" style="width: 16px; height: 16px; position: absolute; top: 10px; left: 4px" title="Archivos adjuntos"/>',
            '<div class="divg1"><div class="divg2"><span title="Proceso código">○ Proceso código <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Estatus seguimiento">○ Estatus seguim <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Estatus etapa">○ <span style="color: #F87508; font-weight: bold">Estatus etapa</span> <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Estatus Limite">○ Estatus Limite <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Prioridad y ultimo comentario">○ Prior y ult com <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Responsable actual">○ Resp actual <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Solicitante | Fuente">○ Solicitante | Fuente<img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Descripción">○ Descripción</span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Docto externo">○ Docto externo <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Docto tipo código">○ Docto tipo cód <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Contacto primario">○ Contacto prim</span><br/><span title="Celular o teléfono">○ Celular o tel</span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Sucursal código">○ Suc cod <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Forma Jerarquía\n\nPadre: Forma que cuenta con una o varias sub formas\nHijo: Forma hija que tiene un padre ID\nPadre e hijo: Forma hija que tiene un padre Id y a su vez cuenta con una o varias sub formas\nAutónomo: Forma que no cuenta con un padre ID o sub formas">○ Frm Jerarquía</span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Creado">○ Creado <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span><br/><span title="Limite cerrar">○ Limite cerrar <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span></div></div>',
            '<div class="divg1"><div class="divg2"><span title="Estatus cerrado">○ Estatus cerrado <img src="' + iUrl + '/flecha_azul_arriba.png" class="iSortHs" /></span><br/><span title="Cerrado ultima vez">○ Cerrado ult vez <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></span></div></div>',
            ''
        ],
        null,
        [
            '',
            '',
            'text-align: center',
            '',
            '',//font-family: "Arial Narrow", Arial, sans-serif; color: #4b4b4b; font-size: 13px
            '',
            '',
            '',
            '',
            '',
            '',
            'background-color: #FFF6F4',
            ''
        ]);
        //110
    GLO.grid_Procesos.setInitWidths("20,120,20,135,140,135,132,0,120,110,100,120,25");
    //GLO.grid_Procesos.setInitWidthsP("2,9,2,10,10,10,10,10,8,9,8,10,2");
    GLO.grid_Procesos.setColAlign("left,left,center,left,left,left,left,left,left,left,left,left,left");
    GLO.grid_Procesos.setColVAlign('top,top,top,top,top,top,top,top,top,top,top,top,top');
    GLO.grid_Procesos.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
    GLO.grid_Procesos.setColSorting("na,na,na,na,na,na,na,na,na,na,na,na,na");

    GLO.grid_Procesos.setColumnHidden(7, true);

    GLO.grid_Procesos.init();

    GLO.grid_Procesos.enableBlockSelection(true);
    GLO.grid_Procesos.forceLabelSelection(true);
    GLO.grid_Procesos.attachEvent("onKeyPress", function () {
        if (event.keyCode === 67 && event.ctrlKey) {
            GLO.grid_Procesos.copyBlockToClipboard();
            GLO.grid_Procesos.clearSelection();
            setTimeout('GLO.grid_Procesos._HideSelection()', 100);
            return true;
        }
    });

    GLO.grid_Procesos.attachEvent('onBeforeSelect', function (rid, orow, ind) {
        if (orow % 2 === 0) {
            GLO.grid_Procesos.setRowTextStyle(orow, 'background-color: #f8f8f8');
            GLO.grid_Procesos.setCellTextStyle(orow, "0", "padding-left: 2px; background-color: #f8f8f8");
        }
        else {
            GLO.grid_Procesos.setRowTextStyle(orow, 'background-color: #FFF');
            GLO.grid_Procesos.setCellTextStyle(orow, "0", "padding-left: 2px; background-color: #FFF");
        }

        GLO.grid_Procesos.setRowTextStyle(rid, 'background-color: #FFF6F4');
        GLO.grid_Procesos.setCellTextStyle(rid, "0", 'padding-left: 2px; background-color: #FFF6F4');

        return true;
    });

    GLO.grid_Procesos.attachEvent('onRowSelect', function (rid, ind) {

        

        return true;
    });

    GLO.grid_Procesos.attachEvent('onMouseOver', function (rid, ind) {
        var rec = GLO.grid_Procesos.getRowData(rid);

        //GLO.grid_Procesos.cells(rid, ind).cell.title = GLO.grid_Procesos.cells(rid, ind).getValue().replace("<br>", "\n");
    });

    GetData();
}

function GetData() {
    var json = "{rows:[{id:1,data:[\"\",\"<span title='1344'>1344</span><br><span title='0 de 3 Padre:8777'><span style='color: #BA1919'>0 de 3 -</span> P:8777</span>\",\"\",\"<span title='Venta de llantas'>V-LLANTAS</span><br><span title='Venta de llantas'>Venta de llantas</span>\",\"<span title='Producto perdido'>Producto perdido</span><br><span title='2023-Mayo-23 11:30'>23-May-23 11:30</span>\",\"<span title='Alta 2023-Mayo-20 16:15\\n\\nUltimos comentarios:\\n2023-Mayo-20 16:10: Comentario de prueba 1\\n2023-Mayo-19 15:16: Comentario de prueba 2'><span style='color: #BA1919;'>Alta</span> 23-May-20 16:15</span><br><span title='Juan Perez\\nSolicitante: Mario1 (Mario López)'>Juan Perez</span>\",\"<span title='e-comerce'>e-commerce</span><br><span title='2 michelin 15'>2 michelin 15</span>\",\"<span title='23444'>23444</span><br><span title='COTIZACION'>COTIZACION</span>\",\"<span title='Raul Dominguez'>Raul Dominguez</span><br><span title='5543211234'>5543211234</span>\",\"<span title='233GDL-PATRIA'>23GDL-PATRIA</span><br><span title='Padre e hijo'>Padre e hijo</span>\",\"<span title='2023-Mayo-03 11:42'>23-May-03 11:42</span><br><span style='color: #BA1919' title='2023-Junio-07 14:42'>23-Jun-07 14:42</span>\",\"<span style='color: #BA1919' title='Cerrado No exitoso'>Cerrado No exitoso</span><br><span title='2023-Mayo-05 17:34'>23-May-05 17:34</span>\",\"<img src='" + iUrl + "/trash.png' class='i16' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false},{id:2,data:[\"\",\"<span title='1344'>1344</span>\",\"<img src='" + iUrl + "/paper_clip.svg' class='i16' />\",\"<span title='Venta de llantas'>V-LLANTAS</span><br><span title='Venta de llantas'>Venta de llantas</span>\",\"<span title='Producto perdido'>Producto perdido</span><br><span title='2023-Oct-04 11:30'>Hoy 11:30</span>\",\"<span title='Alta\\n\\nUltimos comentarios:\\n2023-Mayo-20 16:10: Comentario de prueba 1'>Alta</span><br><span title='Juan Perez\\nSolicitante: Mario1 (Mario López)'>Juan Perez</span>\",\"<span title='Enrique Méndez | e-comerce'>Enrique Méndez | e-commerce</span><br><span title='2 michelin 15'>2 michelin 15</span>\",\"\",\"\",\"<span title='13MNT-ARROYO'>13MNT-ARROYO</span><br><span title='Autónomo'>Autónomo</span>\",\"<span title='2023-Mayo-03 11:42'>23-May-03 11:42</span><br><span style='color: #BA1919' title='2023-Junio-07 17:42'>23-Jun-07 17:42</span>\",\"<span style='color: #00B050' title='Cerrado exitoso'>Cerrado exitoso</span><br><span title='2023-Mayo-04 09:03'>23-May-04 09:03</span>\",\"<img src='" + iUrl + "/trash.png' class='i16' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false},{id:3,data:[\"<img src='" + iUrl + "/campana_morado.svg' class='i18' />\",\"<span title='1332'>1332</span><br><span style='3 de 3'>3 de 3</span>\",\"\",\"<span title='Reembolso'>REEMB</span><br><span title='Reembolso solicitado'>Reembolso solicitado</span>\",\"<span title='Creado'>Creado</span><br>\",\"<span title='Media 2023-Mayo-11 09:22'>Media 23-May-11 09:22</span><br><span title='Daniel Jasso\\nSolicitante: XXX (Maximiliano)'>Daniel Jasso</span>\",\"<span title='Aaron Villareal'>Aaron Villareal</span><br><span title='15 días en tienda nueva'>15 días en tienda nueva</span>\",\"\",\"\",\"<br><span title='Padre'>Padre</span>\",\"<span title='2023-Julio-22 09:35'>23-Jul-22 09:35</span><br><div style='background-color: #7030A0; color: #FFF' title='2023-Julio-22 14:35'>23-Jul-22 14:35</div>\",\"<span title='Abierto'>Abierto</span><br>\",\"<img src='" + iUrl + "/trash.png' class='i16' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false},{id:4,data:[\"<img src='" + iUrl + "/campana_lila.svg' class='i18' />\",\"<span title='1344'>1344</span><br><span style='Padre: 8778'>P:8778</span>\",\"\",\"<span title='GARANTIA'>GARANTIA</span><br><span title='Garantia solicitada'>Garantia solicitada</span>\",\"<span title='Creado'>Creado</span><br>\",\"<div style='background-color: #F2F2F2;' title='Media'>Media</div><span title='Juan Perez\\nSolicitante: Mario1 (Mario López)'>Juan Perez</span>\",\"<span title='Aaron Villareal'>Aaron Villareal</span><br><span title='15 días en tienda nueva'>15 días en tienda nueva</span>\",\"\",\"\",\"<br><span title='Hijo'>Hijo</span>\",\"<span title='2023-Julio-22 09:35'>23-Jul-22 09:35</span><br><div style='background-color: #B482DA; color: #FFF' title='2023-Julio-22 09:35'>23-Jul-22 09:35</div>\",\"<span style='color: #B482DA;' title='Reabierto'>Reabierto</span><br><span style='color: #B482DA;' title='2023-Mayo-05 17:34'>23-May-05 17:34</span>\",\"<img src='" + iUrl + "/trash.png' class='i16' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false}]}";
    GLO.grid_Procesos.parse(json, 'json');

    GLO.grid_Procesos.setRowTextStyle(3, 'color: #a5a5a5');

    var all = GLO.grid_Procesos.getAllRowIds();
    var rows = all.split(",");//f5f5f5, #fafafa
    if (all != "") {
        for (var i = 1; i <= rows.length; i++) {
            if (i % 2 === 0) {
                GLO.grid_Procesos.setRowTextStyle(rows[i - 1], 'background-color: #f8f8f8');
                GLO.grid_Procesos.setCellTextStyle(rows[i - 1], "0", "padding-left: 2px; background-color: #f8f8f8");
            }
            else
                GLO.grid_Procesos.setCellTextStyle(rows[i - 1], "0", "padding-left: 2px");
        }
    }

    resize();
}

function resize() {
    var w = window.innerWidth;
    if (w <= 1200) {
        GLO.grid_Procesos.setColWidth(4, "140");
        GLO.grid_Procesos.setColWidth(6, "132");
    }
    else {
        let width_4 = 140;
        let width_6 = 132;
        if ((w - 1200) <= 70)
            width_4 += w - 1200;
        else {
            width_4 += 70;
            width_6 += w - 1200 - 70;
        }

        GLO.grid_Procesos.setColWidth(4, width_4);
        GLO.grid_Procesos.setColWidth(6, width_6);
    }
    setTimeout(function () {
        document.getElementsByClassName("gridbox")[0].style.width = "100%";
    }, 500);
}