# Developer Quick Reference

## Module Structure & API

### 1. ArticleService Module

**Location:** `app/js/articleService.js`

**Purpose:** Promise-based data fetching for articles, companies, and tags

**Public Methods:**

```javascript
// Get all companies
ArticleService.getCompanies()
  .then(companies => {
    // companies: Array<{id, name}>
  });

// Get tags for a specific company
ArticleService.getTagsByCompany('co-01')
  .then(tags => {
    // tags: Array<{label, color}>
  });

// Get articles filtered by company
ArticleService.getArticles('co-01')
  .then(articles => {
    // articles: Array<Article>
  });

// Get single article by ID
ArticleService.getArticleById('issue-0001')
  .then(article => {
    // article: Article object or null
  });

// Get company by ID
ArticleService.getCompanyById('co-01')
  .then(company => {
    // company: Company object or null
  });
```

---

### 2. UserService Module

**Location:** `app/js/userService.js`

**Purpose:** User authentication and role-based access control

**Public Methods:**

```javascript
// Get current logged-in user
const currentUser = UserService.getCurrentUser();
// Returns: {id, name, role, companyId}

// Check if current user is administrator
if (UserService.isAdministrator()) {
  // Show admin-only features
}

// Check if current user is regular user
if (UserService.isRegularUser()) {
  // Show regular user features
}

// Get current user's company ID
const companyId = UserService.getCurrentUserCompanyId();
// Returns: string (company ID) or null

// Set company for admin (admin only)
UserService.setCurrentCompanyForAdmin('co-02');

// Toggle between roles (testing only)
const newUser = UserService.toggleUserRole();
```

**Mock Users:**
```javascript
{
  admin: {
    id: 'user-admin-01',
    name: 'Admin Usuario',
    role: 'admin',
    companyId: null
  },
  regular: {
    id: 'user-regular-01',
    name: 'Usuario Regular',
    role: 'regular',
    companyId: 'co-01'
  }
}
```

---

### 3. ArticleDetailUI Module

**Location:** `app/js/articleDetailUI.js`

**Purpose:** Render article details in sidebar

**Public Methods:**

```javascript
// Render complete article detail sidebar
const html = ArticleDetailUI.renderArticleDetailSidebar(
  article,        // Article object
  companyName,    // Company name string
  showEditButton  // boolean (true for admin)
);

// Render empty state (no article selected)
const emptyHtml = ArticleDetailUI.renderEmptyState();

// Format date from YYYY-MM-DD to readable format
const formattedDate = ArticleDetailUI.formatDate('2026-01-20');
// Returns: "20 de enero de 2026"
```

---

### 4. Data Models

**Location:** `app/js/dataModels.js`

**Status Configuration:**

```javascript
const statusConfig = getStatusConfiguration('Abierto');
// Returns: {label, color, bulletColor}
```

**Available Statuses:**
- `'Abierto'` - Green (#52c41a)
- `'En progreso'` - Blue (#1890ff)
- `'Esperando'` - Orange (#faad14)
- `'Cerrado'` - Gray (#8c8c8c)

---

### 5. Grid Helper Functions

**Location:** `app/js/articlesGridHelper.js`

**Main Function:**

```javascript
// Initialize articles grid
const grid = initializeArticlesGrid(gridCell, articlesArray);

// Grid configuration:
// - Columns: Checkbox, Status, Title, Tags, Modified, Created
// - Pagination: 6 rows per page
// - Multi-select enabled
// - Custom cell templates for status, title, and tags
```

**Template Functions:**

```javascript
// Render status cell with colored bullet
const statusHtml = renderStatusCellTemplate(statusValue, statusConfig);

// Render title cell with description preview
const titleHtml = renderTitleCellTemplate(title, description);

// Render tags as colored badges
const tagsHtml = renderTagsCellTemplate(tagsArray);
```

---

## Common Patterns

### Loading Data Flow (Admin)

```javascript
// 1. Initialize application
initializeApplication()
  ↓
// 2. Get current user
UserService.getCurrentUser()
  ↓
// 3. Load companies
ArticleService.getCompanies()
  ↓
// 4. Create company combo picker
createCompanyCombo(companies)
  ↓
// 5. Load articles for selected company
loadArticlesForCompany(companyId)
  ↓
// 6. Initialize grid
initializeArticlesGrid(gridCell, articles)
```

### Loading Data Flow (Regular User)

```javascript
// 1. Initialize application
initializeApplication()
  ↓
// 2. Get current user
UserService.getCurrentUser()
  ↓
// 3. Get user's company ID
UserService.getCurrentUserCompanyId()
  ↓
// 4. Hide company picker
// (No picker for regular users)
  ↓
// 5. Load articles for user's company
loadArticlesForCompany(companyId)
  ↓
// 6. Initialize grid
initializeArticlesGrid(gridCell, articles)
```

### Company Change Flow (Admin Only)

```javascript
// 1. User selects different company in combo
onCompanyChange(newCompanyId)
  ↓
// 2. Show loading indicator
dhx4.progressOn()
  ↓
// 3. Clear existing grid
articlesGrid.clearAll()
  ↓
// 4. Clear sidebar
sidebarCell.attachHTMLString(emptyState)
  ↓
// 5. Load new articles
loadArticlesForCompany(newCompanyId)
  ↓
// 6. Reinitialize grid
initializeArticlesGrid(gridCell, articles)
  ↓
// 7. Hide loading indicator
dhx4.progressOff()
```

### Article Selection Flow

```javascript
// 1. User clicks on grid row
grid.attachEvent('onRowSelect', (rowId) => {...})
  ↓
// 2. Fetch article and company data
Promise.all([
  ArticleService.getArticleById(articleId),
  ArticleService.getCompanyById(companyId)
])
  ↓
// 3. Render sidebar
ArticleDetailUI.renderArticleDetailSidebar(...)
  ↓
// 4. Attach edit button event (if admin)
document.getElementById('edit-article-btn').onclick = ...
```

---

## State Management

### Global App State

```javascript
var appState = {
  currentUser: null,              // Current logged-in user object
  selectedCompanyId: null,        // Currently selected company ID
  selectedArticleId: null,        // Currently selected article ID
  articlesGrid: null,             // DHTMLX grid instance
  companyCombo: null,             // DHTMLX combo instance (admin only)
  sidebarCell: null               // DHTMLX layout cell for sidebar
};
```

**Accessing State:**
```javascript
// Get current user
const user = appState.currentUser;

// Get selected company
const companyId = appState.selectedCompanyId;

// Get grid instance
const grid = appState.articlesGrid;

// Get selected article
const articleId = appState.selectedArticleId;
```

---

## DHTMLX 5.x Component Usage

### Layout

```javascript
// Create main layout
const layout = new dhtmlXLayoutObject(document.body, '2E');

// Get cell reference
const cell = layout.cells('a');

// Set cell height
cell.setHeight('120');

// Fix cell size (not resizable)
cell.fixSize(0, 1);  // (width, height): 0=flexible, 1=fixed

// Hide cell header
cell.hideHeader();

// Attach nested layout
const nestedLayout = cell.attachLayout('3E');
```

**Layout Patterns:**
- `'2E'` - Two cells, equal, horizontal split
- `'2U'` - Two cells, equal, vertical split
- `'3E'` - Three cells, equal, horizontal split
- `'3J'` - Three cells with specific arrangement

### Grid

```javascript
// Attach grid to cell
const grid = cell.attachGrid();

// Set column headers
grid.setHeader(['Col1', 'Col2', 'Col3']);

// Set column types
grid.setColTypes('ro,ro,ch');  // ro=read-only, ch=checkbox

// Set column widths
grid.setInitWidths('120,*,100');  // *=flexible

// Enable features
grid.enableMultiselect(true);
grid.enableResizing('true,true,false');
grid.setColSorting('str,str,na');

// Initialize grid
grid.init();

// Add row
grid.addRow(rowId, ['val1', 'val2', 'val3']);

// Set cell value
grid.cells(rowId, colIndex).setValue('New value');

// Clear all rows
grid.clearAll();

// Attach events
grid.attachEvent('onRowSelect', function(rowId) {
  // Handle selection
});
```

### Combo (dhtmlXCombo)

```javascript
// Get combo from form
const combo = form.getCombo('fieldName');

// Select option by index
combo.selectOption(0);

// Select option by value
combo.selectOption('value');

// Attach event
combo.attachEvent('onChange', function(value) {
  // Handle change
});

// Get selected value
const value = combo.getSelectedValue();
```

### Form

```javascript
// Define form structure
const formData = [
  { 
    type: "settings", 
    position: "label-left", 
    labelWidth: 80 
  },
  { 
    type: "combo", 
    name: "company", 
    label: "Empresa", 
    options: [
      { value: "1", text: "Option 1" }
    ]
  },
  { type: "newcolumn" },
  { 
    type: "input", 
    name: "search", 
    label: "Buscar" 
  }
];

// Attach form to cell
const form = cell.attachForm(formData);

// Get form field
const combo = form.getCombo('company');
const input = form.getInput('search');
```

### Toolbar

```javascript
// Attach toolbar to cell
const toolbar = cell.attachToolbar();

// Add button
toolbar.addButton(id, index, text);

// Add separator
toolbar.addSeparator(id, index);

// Add two-state button (toggle)
toolbar.addButtonTwoState(id, index, text);

// Set button text
toolbar.setItemText(id, 'New Text');

// Set tooltip
toolbar.setItemToolTip(id, 'Tooltip text');

// Attach event
toolbar.attachEvent('onClick', function(id) {
  // Handle click
});
```

---

## Error Handling

### Service Errors

```javascript
ArticleService.getArticles(companyId)
  .then(articles => {
    // Success
  })
  .catch(error => {
    console.error('Error loading articles:', error);
    dhx4.progressOff();
    dhtmlx.alert({
      title: 'Error',
      text: 'Error al cargar artículos: ' + error.message
    });
  });
```

### Common Error Scenarios

1. **No Companies Found**
   ```javascript
   if (companies.length === 0) {
     throw new Error('No companies found');
   }
   ```

2. **User Without Company**
   ```javascript
   if (!appState.selectedCompanyId) {
     dhtmlx.alert({
       title: 'Error',
       text: 'Usuario sin empresa asignada'
     });
     return;
   }
   ```

3. **Article Not Found**
   ```javascript
   if (!article) {
     throw new Error('Article not found');
   }
   ```

---

## Styling Tips

### Custom Scrollbar
```css
.dhxlayout_cont::-webkit-scrollbar {
  width: 8px;
}
```

### Grid Row Styling
```css
.dhtmlxGrid_dhx_web .dhxgrid_data_row {
  min-height: 60px !important;
}
```

### Selection Highlight
```css
.dhtmlxGrid_dhx_web .dhxgrid_data_row.rowselected td {
  background-color: #e6f7ff !important;
}
```

---

## Debugging Tips

### Check Current User
```javascript
console.log('Current User:', UserService.getCurrentUser());
console.log('Is Admin:', UserService.isAdministrator());
```

### Check Grid State
```javascript
console.log('Grid rows:', appState.articlesGrid.getRowsNum());
console.log('Selected row:', appState.articlesGrid.getSelectedRowId());
```

### Check Selected Company
```javascript
console.log('Selected Company:', appState.selectedCompanyId);
```

### Monitor Data Loading
```javascript
ArticleService.getArticles(companyId)
  .then(articles => {
    console.log('Loaded articles:', articles.length);
    console.log('Articles:', articles);
  });
```

---

## Testing Checklist

### As Administrator
- [ ] Company picker is visible
- [ ] Can switch between companies
- [ ] Grid updates when company changes
- [ ] Can see articles from all companies
- [ ] Edit button appears in sidebar
- [ ] Can click edit button

### As Regular User
- [ ] Company picker is hidden
- [ ] See only own company's articles
- [ ] Cannot switch companies
- [ ] Edit button is NOT visible
- [ ] Sidebar shows article details correctly

### Common Functionality
- [ ] Grid pagination works
- [ ] Can select articles in grid
- [ ] Sidebar updates on selection
- [ ] Tags display correctly
- [ ] Status badges show correct colors
- [ ] External links open in new tab
- [ ] Empty state shows when no selection
- [ ] Loading indicator appears during data fetch
- [ ] Role toggle button works

---

## Performance Considerations

1. **Data Caching**: ArticleService caches mock data to avoid redundant loads
2. **Grid Clearing**: Always call `grid.clearAll()` before loading new data
3. **Promise Chaining**: Use Promise.all for parallel data fetching
4. **Event Cleanup**: Destroy old grid instances before creating new ones

---

**Last Updated:** 2026-01-20
