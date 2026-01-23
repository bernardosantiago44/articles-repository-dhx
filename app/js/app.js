window.dhx4.skin = 'dhx_web';
var main_layout = new dhtmlXLayoutObject(document.body, '2E');

var header = main_layout.cells('a');
header.setHeight('80');
header.fixSize(0,1);

var header_stack = header.attachLayout('2U');

var header_leading = header_stack.cells('a');
header_leading.hideHeader();
header_leading.fixSize(1,0);
header_leading.attachHTMLString(`
  <div class="h-full w-full flex items-center justify-between px-4">
    <div>
      <div class="text-lg font-semibold">Repositorio de Artículos</div>
      <div class="text-xs text-gray-500">Gestión de artículos</div>
    </div>
  </div>
`);

var header_trailing = header_stack.cells('b');
header_trailing.setWidth('320');
header_trailing.hideHeader();
header_trailing.fixSize(1,0);

var header_toolbar = header_trailing.attachToolbar();
header_toolbar.setIconsPath('./codebase/imgs/');
header_toolbar.addButton('new_article', 1, 'Nuevo artículo');
header_toolbar.addButton('admin', 2, 'Administrador');
header_toolbar.attachEvent('onClick', function(id){
  alert('Click: ' + id);
});

main_layout.setSizes();

var main_content = main_layout.cells('b');
var tabbar = main_content.attachTabbar();
tabbar.addTab('articles','Artículos');
var articles = tabbar.cells('articles');
articles.setActive();
var filters_grid_pager = articles.attachLayout('3E');

var filters = filters_grid_pager.cells('a');
filters.setHeight('120');
filters.hideHeader();
filters.fixSize(0,1);
var layout_3 = filters.attachLayout('2E');

var filters_toolbar = layout_3.cells('a');
filters_toolbar.setHeight('38');
filters_toolbar.hideHeader();
filters_toolbar.fixSize(0,1);


var filters_form = layout_3.cells('b');
filters_form.hideHeader();
filters_form.fixSize(0,1);

var grid = filters_grid_pager.cells('b');
grid.hideHeader();
var articles_grid = grid.attachGrid();
articles_grid.setIconsPath('./wwwroot/Dhtmlx/codebase/imgs/dhxgrid_material/');
articles_grid.enableMultiselect(true);

articles_grid.setHeader(["","Estatus","Título","Modificado","Creado"]);
articles_grid.setColTypes("ch,ro,ro,ro,ro");

articles_grid.enableResizing('false,false,true,false,false');
articles_grid.setColSorting('bool,str,str,str,str');
articles_grid.setInitWidths('40,100,*,140,140');
articles_grid.init();
articles_grid.attachFooter(["<div id='articles_grid_recinfoArea' style='width:100%;height:100%'></div>","#cspan","#cspan","#cspan"],['height:25px;text-align:left;background:transparent;border-color:white;padding:0px;']);
articles_grid.enablePaging(true, 6,  3,'articles_grid_recinfoArea');
articles_grid.setPagingSkin('bricks','dhx_skyblue');
articles_grid.load('./data/grid.xml', 'xml');

var pager = filters_grid_pager.cells('c');
pager.setHeight(40);
pager.hideHeader();
pager.fixSize(0,1);

tabbar.addTab('files','Archivos');
var files = tabbar.cells('files');


tabbar.addTab('images','Imágenes');
var images = tabbar.cells('images');

var formData = [
  { type:"settings", position:"label-left", labelWidth:80, inputWidth:260, offsetLeft:10, offsetTop:10 },
  { type:"combo", name:"company", label:"Empresa", options:[
    { value:"acme", text:"Acme Corporation" },
    { value:"globex", text:"Globex", selected:true }
  ]},
  { type:"newcolumn" },
  { type:"input", name:"search", label:"Buscar", inputWidth: 320 }
];

var frm = filters_form.attachForm(formData);

main_layout.setSizes();