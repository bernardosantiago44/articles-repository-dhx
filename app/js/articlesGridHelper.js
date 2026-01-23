/**
 * Articles Grid Helper Module
 * Provides utility functions and templates for rendering the articles grid
 */

/**
 * Generate HTML template for status column with colored bullet
 * @param {string} statusValue - The status value
 * @param {Object} statusConfig - Status configuration object
 * @returns {string} HTML string for status cell
 */
function renderStatusCellTemplate(statusValue, statusConfig) {
  const bulletColor = statusConfig.bulletColor || '#000000';
  const label = statusConfig.label || statusValue;
  
  return `
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${bulletColor}; display: inline-block;"></span>
      <span style="font-size: 13px;">${label}</span>
    </div>
  `;
}

/**
 * Generate HTML template for title column with title and description
 * @param {string} title - Article title
 * @param {string} description - Article description
 * @returns {string} HTML string for title cell
 */
function renderTitleCellTemplate(title, description) {
  // Truncate description to 80 characters for preview
  const truncatedDescription = description.length > 80 
    ? description.substring(0, 80) + '...' 
    : description;
  
  return `
    <div style="padding: 4px 0;">
      <div style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${title}</div>
      <div style="font-size: 12px; color: #8c8c8c; line-height: 1.4;">${truncatedDescription}</div>
    </div>
  `;
}

/**
 * Generate HTML template for tags column with colored badges
 * @param {Array<{label: string, color: string}>} tags - Array of tag objects
 * @returns {string} HTML string for tags cell
 */
function renderTagsCellTemplate(tags) {
  if (!tags || tags.length === 0) {
    return '<div></div>';
  }
  
  const tagsHtml = tags.map(tag => {
    return `<span style="display: inline-block; padding: 2px 8px; margin: 2px; border-radius: 4px; background-color: ${tag.color}; color: white; font-size: 11px; font-weight: 500;">${tag.label}</span>`;
  }).join('');
  
  return `<div style="display: flex; flex-wrap: wrap; gap: 4px;">${tagsHtml}</div>`;
}

/**
 * Transform article data from JSON format to DHTMLX grid format
 * @param {Array<Article>} articles - Array of article objects
 * @returns {Object} DHTMLX grid data object
 */
function transformArticlesDataForGrid(articles) {
  const gridRows = articles.map(article => {
    const statusConfig = getStatusConfiguration(article.status);
    
    return {
      id: article.id,
      data: [
        0, // checkbox column (will be managed by grid)
        renderStatusCellTemplate(article.status, statusConfig),
        renderTitleCellTemplate(article.title, article.description),
        renderTagsCellTemplate(article.tags),
        article.updatedAt,
        article.createdAt
      ]
    };
  });
  
  return gridRows;
}

/**
 * Initialize and configure the articles grid
 * @param {Object} gridCell - DHTMLX layout cell where grid will be attached
 * @param {Array<Article>} articlesData - Array of article objects
 * @returns {Object} Configured DHTMLX grid instance
 */
function initializeArticlesGrid(gridCell, articlesData) {
  const articlesGrid = gridCell.attachGrid();
  
  // Configure grid appearance
  articlesGrid.setIconsPath('./wwwroot/Dhtmlx/codebase/imgs/dhxgrid_material/');
  articlesGrid.enableMultiselect(true);
  
  // Define column headers
  articlesGrid.setHeader([
    "",
    "Estatus",
    "Título",
    "Tags",
    "Modificado",
    "Creado"
  ]);
  
  // Define column types (ch=checkbox, ro=read-only, html=HTML content)
  articlesGrid.setColTypes("ch,ro,ro,ro,ro,ro");
  
  // Configure column resizing (checkbox and status not resizable)
  articlesGrid.enableResizing('false,false,true,true,false,false');
  
  // Configure column sorting
  articlesGrid.setColSorting('bool,str,str,na,str,str');
  
  // Set initial column widths
  articlesGrid.setInitWidths('40,120,*,180,120,120');
  
  // Initialize the grid
  articlesGrid.init();
  
  // Add footer with pagination
  articlesGrid.attachFooter([
    "<div id='articles_grid_recinfoArea' style='width:100%;height:100%'></div>",
    "#cspan",
    "#cspan",
    "#cspan",
    "#cspan",
    "#cspan"
  ], ['height:30px;text-align:left;background:transparent;border-color:white;padding:0px;']);
  
  // Enable pagination
  articlesGrid.enablePaging(true, 6, 3, 'articles_grid_recinfoArea');
  articlesGrid.setPagingSkin('bricks', 'dhx_skyblue');
  
  // Transform and add the data
  articlesData.forEach(article => {
    const statusConfig = getStatusConfiguration(article.status);
    const rowId = article.id;
    
    articlesGrid.addRow(rowId, [
      0, // checkbox
      article.status,
      article.title,
      article.tags.map(t => t.label).join(', '),
      article.updatedAt,
      article.createdAt
    ]);
    
    // Set HTML content for cells that need custom rendering
    articlesGrid.cells(rowId, 1).setValue(renderStatusCellTemplate(article.status, statusConfig));
    articlesGrid.cells(rowId, 2).setValue(renderTitleCellTemplate(article.title, article.description));
    articlesGrid.cells(rowId, 3).setValue(renderTagsCellTemplate(article.tags));
  });
  
  return articlesGrid;
}

/**
 * Load articles data from JSON file
 * @param {string} jsonFilePath - Path to the JSON file
 * @param {Function} callback - Callback function to handle loaded data
 */
function loadArticlesDataFromJson(jsonFilePath, callback) {
  fetch(jsonFilePath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load articles data: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      callback(null, data);
    })
    .catch(error => {
      console.error('Error loading articles data:', error);
      callback(error, null);
    });
}
