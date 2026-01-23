var GLO = {};


dhtmlxEvent(window, "load", function () {
    init();
});

function init() {
    window.dhx4.skin = 'material';

    var main_layout = new dhtmlXLayoutObject(document.body, '3E');

    var main_a = main_layout.cells('a');
    main_a.setHeight('110');
    main_a.hideHeader();
    main_a.fixSize(0, 1);
    //main_a.attachHTMLString('');
    main_a.attachObject('frm1');

    var main_b = main_layout.cells('b');
    main_b.hideHeader();
    main_b.setHeight('40');
    main_b.fixSize(0, 1);
    main_b.attachObject('frm2');

    var main_grid = main_layout.cells('c');
    main_grid.setText('');
    main_grid.hideHeader();
    GLO.grid_Procesos = main_grid.attachGrid();

    //GetColTitles();

    //initforeignfile();

    Configura_gridProcesos();

    UTILS.getDom("frm1").style.visibility = "visible";
    UTILS.getDom("frm2").style.visibility = "visible";
    document.getElementsByClassName("dhx_cell_hdr")[2].style.border = "none";
    document.getElementsByClassName("dhx_cell_cont_layout")[2].style.border = "none";
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
    GLO.grid_Procesos.setStyle(
        "text-align: left; vertical-align: bottom; color: #000; font-weight: bold; background-color: #FFF; border: none; padding-left: 4px; font-size: 11px",
        "color: #232323; font-size: 11px; line-height: 180%; border: none;",
        ""
    );
    GLO.grid_Procesos.setHeader(
        [
            '<div class="divg1"><div class="divg2">○ Forma ID <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ SubFrm y padre ID</div></div>',
            '#cspan',
            '<img src="' + iUrl + '/paper_clip.svg" style="width: 20px; height: 20px;" />',
            '<div class="divg1"><div class="divg2">○ Proceso código <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Estatus seguim <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></div></div>',
            '<div class="divg1"><div class="divg2">○ Estatus estapa <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Estatus Limite <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></div></div>',
            '<div class="divg1"><div class="divg2">○ Prior y ult com <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Resp actual <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></div></div>',
            '<div class="divg1"><div class="divg2">○ Requerido por <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Descripción</div></div>',
            '<div class="divg1"><div class="divg2">○ Folio externo <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Tipo Folio cód <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></div></div>',
            '<div class="divg1"><div class="divg2">○ Contacto prim<br/>○ Celular o tel</div></div>',
            '<div class="divg1"><div class="divg2">○ Suc cod <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Frm Jerarquía</div></div>',
            '<div class="divg1"><div class="divg2">○ Creado <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /><br/>○ Limite cerrar <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></div></div>',
            '<div class="divg1"><div class="divg2">○ Estatus cerrado <img src="' + iUrl + '/flecha_azul_arriba.png" class="iSortHs" /><br/>○ Cerrado ult vez <img src="' + iUrl + '/flechas_gris.png" class="iSortH" /></div></div>',
            ''
        ],
        null,
        [
            'text-align: center',
            '',
            'text-align: center',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            'background-color: #DEEAF6',
            ''
        ]);
    GLO.grid_Procesos.setInitWidths("20,110,20,125,130,120,*,110,100,100,100,120,20");
    GLO.grid_Procesos.setColAlign("center,left,center,left,left,left,left,left,left,left,left,left,center");
    GLO.grid_Procesos.setColVAlign('middle,top,middle,top,top,top,top,top,top,top,top,top,middle');
    GLO.grid_Procesos.setColTypes("ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro,ro");
    GLO.grid_Procesos.setColSorting("na,na,na,na,na,na,na,na,na,na,na,na,na");



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

    GLO.grid_Procesos.attachEvent('onBeforeSelect', function (rid, ind) {
        return true;
    });

    GetData();
}

function GetData() {
    var json = "{rows:[{id:1,data:[\"\",\"1344<br><span style='color: #BA1919'>0 de 3 -</span> P:8777\",\"\",\"V-LLANTAS<br>23-May-20 16:15\",\"Producto perdido<br>23-May-23 11:30\",\"<span style='color: #BA1919; font-weight: bold'>Alta - 23-May-20 16:15</span><br>Juan Perez\",\"e-commerce<br>2 michellin 15\",\"23444<br>COTIZACION\",\"Raul Dominguez</span><br>5543211234\",\"23GDL-PATRIA<br><b>Padre</b>\",\"23-May-03 11:42<br><span style='color: #BA1919'>23-Jun-07 14:42</span>\",\"<span style='color: #BA1919'>Cerrado No exitoso</span><br>23-May-05 17:34\",\"<img src='" + iUrl + "/trash.png' style='width: 16px; height: 16px;' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false},{id:2,data:[\"\",\"1344\",\"<img src='" + iUrl + "/paper_clip.svg' style='width: 16px; height: 16px;' />\",\"V-LLANTAS<br>Venta de llantas\",\"Producto perdido<br>23-May-03 9:30\",\"<span style='font-weight: bold'>Alta</span><br>Juan Perez\",\"e-commerce<br>2 michellin 15\",\"\",\"\",\"13MNT-ARROYO<br><b>Padre e hijo</b>\",\"23-May-03 11:42<br><span style='color: #BA1919'>23-May-07 17:42</span>\",\"<span style='color: #00B050; font-weight: bold'>Cerrado exitoso</span><br>23-May-04 09:03\",\"<img src='" + iUrl + "/trash.png' style='width: 16px; height: 16px;' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false},{id:3,data:[\"<img src='" + iUrl + "/campana_morado.svg' style='width: 18px;height: 18px;' />\",\"1332<br><span style=''>3 de 3</span>\",\"\",\"REEMB<br>Reembolso solicitado\",\"Creado<br><br>\",\"<span style='font-weight: bold'>Media - 23-May-11 09:22</span><br>Daniel Jasso\",\"Aaron Villareal<br>15 días en tienda nueva\",\"\",\"\",\"<br><b>Hijo</b>\",\"23-Jul-22 09:35<br><div style='background-color: #7030A0; color: #FFF'>23-Jul-22 14:35</div>\",\"<span>Abierto</span><br><br>\",\"<img src='" + iUrl + "/trash.png' style='width: 16px; height: 16px;' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false},{id:4,data:[\"<img src='" + iUrl + "/campana_lila.svg' style='width: 18px;height: 18px;' />\",\"1344<br><br>\",\"\",\"GARANTIA<br>Garantia solicitada\",\"Creado<br><br>\",\"<div style='background-color: #F2F2F2; font-weight: bold'>Media</div>Juan Perez\",\"Aaron Villareal<br>15 días en tienda nueva\",\"\",\"\",\"<br><b>Padre</b>\",\"23-Jul-22 09:35<br><div style='background-color: #B482DA; color: #FFF'>23-Jul-23 09:35</div>\",\"<span style='color: #7030A0; font-weight: bold'>Abierto</span><br><span style='color: #7030A0; font-weight: bold'>23-May-05 17:34</span>\",\"<img src='" + iUrl + "/trash.png' style='width: 16px; height: 16px;' />\"],\"userdata\":{},\"bgColor\":\"\",\"style\":\"\",\"selected\":false}]}";
    GLO.grid_Procesos.parse(json, 'json');

    GLO.grid_Procesos.setRowTextStyle(3, 'color: #a5a5a5');

    GLO.grid_Procesos.setCellTextStyle("1", "0", "padding-left: 2px");
    GLO.grid_Procesos.setCellTextStyle("2", "0", "padding-left: 2px");
    GLO.grid_Procesos.setCellTextStyle("3", "0", "padding-left: 2px");
    GLO.grid_Procesos.setCellTextStyle("4", "0", "padding-left: 2px");
}
