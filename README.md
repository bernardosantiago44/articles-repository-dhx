# Articles Repository Application

A comprehensive articles management system built with **DHTMLX 5.x Legacy API**.

## 🎯 Features

### 1. User Role System
The application supports two distinct user roles with different access levels:

#### Administrator Role
- **Full Access**: Can view and manage articles from all companies
- **Company Switching**: Dynamic company picker (dhtmlXCombo) to switch between companies
- **Edit Capabilities**: Can see and use the "Edit" button in article details
- **Unrestricted View**: Access to all articles across the entire system

#### Regular User Role
- **Company-Specific Access**: Assigned to exactly one company (`companyId`)
- **Filtered View**: Grid shows only articles from their assigned company
- **No Company Picker**: Company selector is hidden/destroyed for regular users
- **Read-Only Access**: Cannot see or use the "Edit" button

### 2. Data Services Layer (Promise-Based)

#### ArticleService (`app/js/articleService.js`)
Provides Promise-based data fetching methods:

- `getCompanies()`: Returns all available companies
- `getTagsByCompany(companyId)`: Returns unique tags for a specific company
- `getArticles(companyId)`: Returns filtered articles by company ID
- `getArticleById(articleId)`: Returns a single article
- `getCompanyById(companyId)`: Returns company information

**Key Features:**
- Caching mechanism to avoid redundant file loads
- Promise-based API for modern async/await patterns
- Automatic data filtering by company ID

#### UserService (`app/js/userService.js`)
Manages user authentication and role-based access control:

- `getCurrentUser()`: Returns current logged-in user
- `isAdministrator()`: Check if current user is admin
- `isRegularUser()`: Check if current user is regular user
- `getCurrentUserCompanyId()`: Get user's company ID
- `setCurrentCompanyForAdmin(companyId)`: Allow admin to switch companies
- `toggleUserRole()`: Toggle between roles (for testing)

### 3. Enhanced UI Layout

#### Layout Structure
The application uses a sophisticated layout hierarchy:

```
Main Layout (2E - Two Cells Equal)
├── Header (80px height)
│   ├── Leading Section: App Title
│   └── Trailing Section: Toolbar with actions
└── Main Content (Tabbar)
    └── Articles Tab
        ├── Filters Section (Top, 120px)
        │   ├── Toolbar Area (38px)
        │   └── Form Area (Company Picker + Search)
        ├── Grid + Sidebar Layout (Center)
        │   ├── Articles Grid (Left, flexible)
        │   └── Detail Sidebar (Right, 350px fixed)
        └── Pager Section (Bottom, 40px - collapsed)
```

### 4. Company Picker (dhtmlXCombo)

**For Administrators:**
- Visible combo picker with all companies
- Dynamic data loading from ArticleService
- Real-time filtering when company changes
- Triggers `grid.clearAll()` and reloads data

**For Regular Users:**
- Company picker is hidden/destroyed
- Display message: "Vista de usuario regular"
- Fixed company based on user's assignment

### 5. Article Detail Sidebar

A comprehensive detail view displayed when an article is selected:

#### Structure:
1. **Header Section**
   - Status badge (color-coded)
   - Article ID (small gray text)

2. **Metadata Section**
   - Creation date: "Creado: [formatted date]"
   - Last modified date: "Modificado: [formatted date]"

3. **Title Section**
   - Large, bold primary text
   - Multi-line wrapping support
   - Word-break for long titles

4. **Context Section**
   - Company name display
   - Highlighted background

5. **Tags Section**
   - Horizontal flex-wrap container
   - Color-coded tag badges
   - "Sin etiquetas" message if empty

6. **Links Section**
   - External link button (if available)
   - "Sin enlace externo" message if not available
   - Opens in new tab

7. **Body Sections**
   - **Description**: "Descripción del artículo"
   - **Client Comments**: "Comentarios del cliente"
   - Graceful handling of empty content

8. **Action Section**
   - "Editar Artículo" button
   - **Visible to Administrators ONLY**
   - Green button with hover effect

#### Empty State
When no article is selected, the sidebar shows:
- 📄 Icon
- "Ningún artículo seleccionado" message
- Instruction text

### 6. Loading States

The application uses `dhx4.progressOn()` and `dhx4.progressOff()` to show loading states:

- When initializing the application
- When switching companies (admin only)
- When loading articles data
- Automatically hidden on completion or error

### 7. Data Refresh Pattern

**When Admin Switches Companies:**
1. Show loading indicator (`dhx4.progressOn()`)
2. Call `grid.clearAll()` to clear existing data
3. Clear sidebar and show empty state
4. Fetch new articles for selected company
5. Reinitialize grid with new data
6. Hide loading indicator (`dhx4.progressOff()`)

### 8. Testing Features

#### User Role Toggle
A toolbar button allows switching between Admin and Regular User roles:

- **Button**: "Cambiar a Usuario Regular" / "Cambiar a Administrador"
- **Action**: Toggles current user role
- **Effect**: Page reload to apply new role
- **Purpose**: Easy testing of both user scenarios

**Mock Users:**
- **Admin**: `user-admin-01` - No company restriction
- **Regular User**: `user-regular-01` - Assigned to "Acme Corporation" (co-01)

## 📂 File Structure

```
articles-repository-dhx/
├── index.html                          # Main HTML entry point
├── app/
│   ├── css/
│   │   └── app.css                     # Application styles
│   └── js/
│       ├── app.js                      # Main application logic
│       ├── dataModels.js               # Data models and status config
│       ├── articleService.js           # Article data service (NEW)
│       ├── userService.js              # User authentication service (NEW)
│       ├── articleDetailUI.js          # Sidebar UI helper (NEW)
│       └── articlesGridHelper.js       # Grid helper functions
├── data/
│   └── articles-mock-data.json         # Mock data (companies + articles)
└── wwwroot/
    └── Dhtmlx/                         # DHTMLX 5.x library files
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- Local web server (Python, Node.js, or any HTTP server)

### Running the Application

1. **Clone or download the repository**

2. **Start a local HTTP server:**

   ```bash
   # Using Python 3
   cd articles-repository-dhx
   python3 -m http.server 8888
   
   # Using Node.js (http-server)
   npx http-server -p 8888
   
   # Using PHP
   php -S localhost:8888
   ```

3. **Open in browser:**
   ```
   http://localhost:8888
   ```

### Default User
The application starts in **Administrator** mode by default.

### Testing Both Roles

1. **Switch to Regular User:**
   - Click "Cambiar a Usuario Regular" button in toolbar
   - Confirm the role change
   - Page will reload with Regular User view

2. **Switch back to Admin:**
   - Click "Cambiar a Administrador" button
   - Confirm the role change
   - Page will reload with Admin view

## 🎨 UI Components Used

- **dhtmlXLayoutObject**: Main layout management
- **dhtmlXGridObject**: Articles data grid with pagination
- **dhtmlXCombo**: Company picker dropdown
- **dhtmlXForm**: Filters form with company selector
- **dhtmlXToolbar**: Header action buttons

## 📊 Data Model

### Company
```javascript
{
  "id": "co-01",
  "name": "Acme Corporation"
}
```

### Article
```javascript
{
  "id": "issue-0001",
  "companyId": "co-01",
  "title": "Article title",
  "description": "Detailed description",
  "externalLink": "https://...",
  "clientComments": "Client feedback",
  "status": "Abierto|En progreso|Esperando|Cerrado",
  "tags": [
    { "label": "Urgente", "color": "#ff4d4f" }
  ],
  "createdAt": "2026-01-02",
  "updatedAt": "2026-01-20"
}
```

### User
```javascript
{
  "id": "user-admin-01",
  "name": "Admin Usuario",
  "role": "admin|regular",
  "companyId": null  // null for admin, required for regular
}
```

## 🔧 Customization

### Adding New Companies
Edit `data/articles-mock-data.json` and add to the `companies` array:

```javascript
{
  "id": "co-04",
  "name": "New Company Name"
}
```

### Adding New Articles
Add to the `articles` array with the appropriate `companyId`:

```javascript
{
  "id": "issue-0009",
  "companyId": "co-01",
  "title": "New Article",
  // ... other fields
}
```

### Changing Status Colors
Modify `articleStatusConfiguration` in `app/js/dataModels.js`

### Customizing Sidebar Width
In `app/js/app.js`, adjust the sidebar width:

```javascript
sidebar_cell.setWidth('400');  // Change from 350 to your preferred width
```

## 🎯 Key Technical Decisions

### 1. Modular Architecture
- **Separation of Concerns**: Services, UI helpers, and main app logic are separated
- **Reusability**: Components can be reused across different parts of the application
- **Maintainability**: Easy to locate and modify specific functionality

### 2. Promise-Based Services
- **Modern API**: Uses Promises for async operations
- **Error Handling**: Consistent error handling with `.catch()`
- **Chaining**: Easy to chain multiple async operations

### 3. DHTMLX 5.x Legacy API
- **Strict Compliance**: Uses only DHTMLX 5.x components and methods
- **No Modern API**: Avoids DHTMLX 7.x/8.x syntax
- **Component Types**: `dhtmlXLayoutObject`, `dhtmlXGridObject`, `dhtmlXCombo`, `dhtmlXForm`

### 4. Descriptive Naming
- **Long Variable Names**: Prefer `selectedArticleId` over `selArtId`
- **Function Names**: Clear intention like `loadArticlesForCompany()`
- **Comments**: Extensive JSDoc comments for all functions

### 5. Role-Based Access Control
- **Centralized User Service**: Single source of truth for user state
- **UI Adaptation**: UI adapts based on user role
- **Security Consideration**: In production, should be enforced server-side

## 🐛 Known Limitations

1. **Client-Side Only**: All data and authentication is client-side
2. **Mock Data**: Uses static JSON file instead of real API
3. **No Persistence**: Changes are not saved
4. **Edit Function**: Edit button is placeholder (not implemented)
5. **Search**: Search functionality not yet implemented

## 🔮 Future Enhancements

- [ ] Implement actual edit functionality
- [ ] Add create new article feature
- [ ] Implement search/filter functionality
- [ ] Add sorting and advanced filtering
- [ ] Connect to real backend API
- [ ] Add authentication system
- [ ] Implement article status updates
- [ ] Add file and image management tabs
- [ ] Export articles to PDF/Excel
- [ ] Add notifications system

## 📝 License

This project is for demonstration purposes.

## 👥 Support

For issues or questions, please refer to the code comments or DHTMLX 5.x documentation.

---

**Built with ❤️ using DHTMLX 5.x Legacy API**
