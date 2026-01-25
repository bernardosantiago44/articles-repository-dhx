/**
 * Articles Repository Application - Main Entry Point
 * DHTMLX 5.x Legacy API Implementation
 * 
 * Dependencies (must be loaded in order):
 * - dataModels.js
 * - articleService.js
 * - userService.js
 * - articleDetailUI.js
 * - articlesGridHelper.js
 */

window.dhx4.skin = 'dhx_web';

// ============================================================================
// Global State Management
// ============================================================================

var appState = {
  currentUser: null,
  selectedCompanyId: null,
  selectedArticleId: null,
  articlesGrid: null,
  companyCombo: null,
  sidebarCell: null
};

// ============================================================================
// Main Layout Structure
// ============================================================================

var main_layout = new dhtmlXLayoutObject(document.body, '2E');

// Header Section (80px height)
var header = main_layout.cells('a');
header.setHeight('80');
header.fixSize(0, 1);

var header_stack = header.attachLayout('2U');

// Header Left - Application Title
var header_leading = header_stack.cells('a');
header_leading.hideHeader();
header_leading.fixSize(1, 0);
header_leading.attachHTMLString(`
  <div class="h-full w-full flex items-center justify-between px-4">
    <div>
      <div class="text-lg font-semibold">Repositorio de Artículos</div>
      <div class="text-xs text-gray-500">Gestión de artículos</div>
    </div>
  </div>
`);

// Header Right - Toolbar
var header_trailing = header_stack.cells('b');
header_trailing.setWidth('400');
header_trailing.hideHeader();
header_trailing.fixSize(1, 0);

var header_toolbar = header_trailing.attachToolbar();
header_toolbar.setIconsPath('./codebase/imgs/');
header_toolbar.addButton('new_article', 1, 'Nuevo artículo');
header_toolbar.addSeparator('sep1', 2);
header_toolbar.addButtonTwoState('toggle_user_role', 3, 'Cambiar a Usuario Regular');
header_toolbar.setItemToolTip('toggle_user_role', 'Cambiar entre Admin y Usuario Regular');

// Toolbar Click Handler
header_toolbar.attachEvent('onClick', function(id) {
  if (id === 'new_article') {
    alert('Funcionalidad "Nuevo artículo" - Por implementar');
  } else if (id === 'toggle_user_role') {
    toggleUserRole();
  }
});

main_layout.setSizes();

// ============================================================================
// Main Content - Tabbar
// ============================================================================

var main_content = main_layout.cells('b');
var tabbar = main_content.attachTabbar();

// Articles Tab
tabbar.addTab('articles', 'Artículos');
var articles = tabbar.cells('articles');
articles.setActive();

// Create layout for articles tab with sidebar: Filters (top), Grid (center), Sidebar (right)
var articles_layout = articles.attachLayout('3E');

// ============================================================================
// Filters Section (Top)
// ============================================================================

var filters_container = articles_layout.cells('a');
filters_container.setHeight('120');
filters_container.hideHeader();
filters_container.fixSize(0, 1);

var filters_layout = filters_container.attachLayout('2E');

// Filters Toolbar Area
var filters_toolbar = filters_layout.cells('a');
filters_toolbar.setHeight('38');
filters_toolbar.hideHeader();
filters_toolbar.fixSize(0, 1);

// Filters Form Area
var filters_form_cell = filters_layout.cells('b');
filters_form_cell.hideHeader();
filters_form_cell.fixSize(0, 1);

// ============================================================================
// Grid Section (Center) and Sidebar (Right)
// ============================================================================

var grid_sidebar_layout = articles_layout.cells('b');
grid_sidebar_layout.hideHeader();

// Split into grid and sidebar
var grid_sidebar_split = grid_sidebar_layout.attachLayout('2U');

// Grid Cell
var grid_cell = grid_sidebar_split.cells('a');
grid_cell.hideHeader();

// Sidebar Cell (300-400px width)
var sidebar_cell = grid_sidebar_split.cells('b');
sidebar_cell.setWidth('350');
sidebar_cell.hideHeader();
sidebar_cell.fixSize(1, 0);
appState.sidebarCell = sidebar_cell;

// Show empty state initially
sidebar_cell.attachHTMLString(ArticleDetailUI.renderEmptyState());

// ============================================================================
// Pager Section (Bottom - currently hidden but structure maintained)
// ============================================================================

var pager = articles_layout.cells('c');
pager.setHeight(40);
pager.hideHeader();
pager.fixSize(0, 1);
pager.collapse(); // Hide pager for now

// ============================================================================
// Other Tabs (Placeholder)
// ============================================================================

tabbar.addTab('files', 'Archivos');
var files = tabbar.cells('files');

tabbar.addTab('images', 'Imágenes');
var images = tabbar.cells('images');

// ============================================================================
// Initialize Application
// ============================================================================

/**
 * Initialize the application on load
 */
function initializeApplication() {
  // Show loading indicator on main content cell
  main_content.progressOn();
  
  // Get current user
  appState.currentUser = UserService.getCurrentUser();
  
  // Initialize based on user role
  if (UserService.isAdministrator()) {
    initializeAdminView();
  } else {
    initializeRegularUserView();
  }
}

/**
 * Initialize view for Administrator users
 */
function initializeAdminView() {
  // Load companies and populate company picker
  ArticleService.getCompanies()
    .then(function(companies) {
      if (companies.length === 0) {
        throw new Error('No companies found');
      }
      
      // Create company combo picker
      createCompanyCombo(companies);
      
      // Set initial company (first company)
      appState.selectedCompanyId = companies[0].id;
      appState.companyCombo.selectOption(0);
      
      // Load articles for the selected company
      return loadArticlesForCompany(appState.selectedCompanyId);
    })
    .catch(function(error) {
      console.error('Error initializing admin view:', error);
      main_content.progressOff();
      dhtmlx.alert({
        title: 'Error',
        text: 'Error al cargar datos: ' + error.message
      });
    });
}

/**
 * Initialize view for Regular users
 */
function initializeRegularUserView() {
  // Regular users have a fixed company
  appState.selectedCompanyId = UserService.getCurrentUserCompanyId();
  
  if (!appState.selectedCompanyId) {
    main_content.progressOff();
    dhtmlx.alert({
      title: 'Error',
      text: 'Usuario sin empresa asignada'
    });
    return;
  }
  
  // Hide company picker for regular users
  filters_form_cell.attachHTMLString('<div style="padding: 20px; font-size: 14px; color: #595959;">Vista de usuario regular</div>');
  
  // Load articles for user's company
  loadArticlesForCompany(appState.selectedCompanyId)
    .catch(function(error) {
      console.error('Error initializing regular user view:', error);
      main_content.progressOff();
      dhtmlx.alert({
        title: 'Error',
        text: 'Error al cargar artículos: ' + error.message
      });
    });
}

/**
 * Create and configure the company combo picker for administrators
 * @param {Array<Company>} companies - List of companies
 */
function createCompanyCombo(companies) {
  var formData = [
    { 
      type: "settings", 
      position: "label-left", 
      labelWidth: 80, 
      inputWidth: 300, 
      offsetLeft: 10, 
      offsetTop: 10 
    },
    { 
      type: "combo", 
      name: "company", 
      label: "Empresa", 
      options: companies.map(function(company, index) {
        return {
          value: company.id,
          text: company.name,
          selected: index === 0
        };
      })
    },
    { type: "newcolumn" },
    { 
      type: "input", 
      name: "search", 
      label: "Buscar", 
      inputWidth: 320 
    }
  ];
  
  var filters_form = filters_form_cell.attachForm(formData);
  appState.companyCombo = filters_form.getCombo('company');
  
  // Attach event listener for company change
  appState.companyCombo.attachEvent('onChange', function(value) {
    onCompanyChange(value);
  });
}

/**
 * Handle company change event (admin only)
 * @param {string} companyId - Selected company ID
 */
function onCompanyChange(companyId) {
  main_content.progressOn();
  
  appState.selectedCompanyId = companyId;
  UserService.setCurrentCompanyForAdmin(companyId);
  
  // Clear current grid
  if (appState.articlesGrid) {
    appState.articlesGrid.clearAll();
  }
  
  // Clear sidebar
  appState.selectedArticleId = null;
  appState.sidebarCell.attachHTMLString(ArticleDetailUI.renderEmptyState());
  
  // Reload articles for new company
  loadArticlesForCompany(companyId)
    .catch(function(error) {
      console.error('Error loading articles after company change:', error);
      main_content.progressOff();
      dhtmlx.alert({
        title: 'Error',
        text: 'Error al cargar artículos: ' + error.message
      });
    });
}

/**
 * Load articles for a specific company and populate the grid
 * @param {string} companyId - Company ID to load articles for
 * @returns {Promise} Promise that resolves when articles are loaded
 */
function loadArticlesForCompany(companyId) {
  return ArticleService.getArticles(companyId)
    .then(function(articles) {
      // Destroy existing grid if it exists
      // Note: destructor() handles cleanup including clearing data
      if (appState.articlesGrid) {
        appState.articlesGrid.destructor();
        appState.articlesGrid = null;
      }
      
      // Initialize new grid with articles
      appState.articlesGrid = initializeArticlesGrid(grid_cell, articles);
      
      // Attach row selection event
      appState.articlesGrid.attachEvent('onRowSelect', function(rowId) {
        onArticleSelect(rowId);
      });
      
      main_content.progressOff();
      return articles;
    });
}

/**
 * Handle article selection in the grid
 * @param {string} articleId - Selected article ID
 */
function onArticleSelect(articleId) {
  appState.selectedArticleId = articleId;
  
  // Fetch article details and company info
  Promise.all([
    ArticleService.getArticleById(articleId),
    ArticleService.getCompanyById(appState.selectedCompanyId)
  ])
    .then(function(results) {
      var article = results[0];
      var company = results[1];
      
      if (!article) {
        throw new Error('Article not found');
      }
      
      var companyName = company ? company.name : 'Desconocida';
      var showEditButton = UserService.isAdministrator();
      
      // Render article details in sidebar
      var detailHtml = ArticleDetailUI.renderArticleDetailSidebar(article, companyName, showEditButton);
      appState.sidebarCell.attachHTMLString(detailHtml);
      
      // Attach edit button event if admin
      // Note: Using requestAnimationFrame to ensure DOM is ready after attachHTMLString
      // This is more efficient than setTimeout and executes on the next frame
      if (showEditButton) {
        requestAnimationFrame(function() {
          var editBtn = document.getElementById('edit-article-btn');
          if (editBtn) {
            editBtn.onclick = function() {
              alert('Editar artículo: ' + articleId + '\n(Funcionalidad por implementar)');
            };
          } else {
            console.warn('Edit button not found in DOM');
          }
        });
      }
    })
    .catch(function(error) {
      console.error('Error loading article details:', error);
      appState.sidebarCell.attachHTMLString(
        '<div style="padding: 20px; color: #ff4d4f;">Error al cargar detalles del artículo</div>'
      );
    });
}

/**
 * Toggle between Admin and Regular User roles (for testing)
 */
function toggleUserRole() {
  var previousUser = appState.currentUser;
  var newUser = UserService.toggleUserRole();
  
  // Update toolbar button text
  if (newUser.role === 'admin') {
    header_toolbar.setItemText('toggle_user_role', 'Cambiar a Usuario Regular');
  } else {
    header_toolbar.setItemText('toggle_user_role', 'Cambiar a Administrador');
  }
  
  // Show confirmation
  dhtmlx.confirm({
    title: 'Rol cambiado',
    text: 'Cambiado de ' + previousUser.role + ' a ' + newUser.role + '. La aplicación se reiniciará.',
    callback: function(result) {
      if (result) {
        // Reload the application with new user role
        window.location.reload();
      } else {
        // Revert the change
        UserService.toggleUserRole();
        if (previousUser.role === 'admin') {
          header_toolbar.setItemText('toggle_user_role', 'Cambiar a Usuario Regular');
        } else {
          header_toolbar.setItemText('toggle_user_role', 'Cambiar a Administrador');
        }
      }
    }
  });
}

// ============================================================================
// Application Entry Point
// ============================================================================

// Initialize application when DOM is ready
initializeApplication();

main_layout.setSizes();