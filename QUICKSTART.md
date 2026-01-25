# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server
```bash
# Navigate to the project directory first
python3 -m http.server 8888
```

### Step 2: Open in Browser
Navigate to: `http://localhost:8888`

### Step 3: Test the Application

#### Default View (Administrator)
- You'll see a **company picker** at the top
- Select different companies to see their articles
- Click on any article to see details in the right sidebar
- Notice the **"Editar Artículo"** button at the bottom (Admin only)

#### Switch to Regular User
1. Click **"Cambiar a Usuario Regular"** in the top-right toolbar
2. Confirm the dialog
3. Page reloads
4. Company picker is now hidden
5. Grid shows only articles from "Acme Corporation"
6. Edit button is NOT visible in sidebar

#### Switch Back to Admin
1. Click **"Cambiar a Administrador"** in the toolbar
2. Confirm and page reloads
3. All admin features are back

---

## 📋 What You'll See

### Administrator View
```
┌─────────────────────────────────────────────────────┐
│  Repositorio de Artículos           [New] [Toggle]  │
├─────────────────────────────────────────────────────┤
│  Empresa: [Select ▼]    Buscar: [______]            │
├────────────────────────┬────────────────────────────┤
│                        │  ┌──────────────────────┐ │
│   ☐ Status  Title      │  │   Article Details    │ │
│   ☐ ...     ...        │  │                      │ │
│   ☐ ...     ...        │  │  Status: [Abierto]   │ │
│   ☐ ...     ...        │  │  ID: issue-0001      │ │
│                        │  │  ─────────────────   │ │
│  [1] [2] [3]           │  │  Title...            │ │
│                        │  │  Company: Acme       │ │
│                        │  │  Tags: [Urgente]...  │ │
│                        │  │  Link: [🔗 Open]     │ │
│                        │  │  Description...      │ │
│                        │  │  Comments...         │ │
│                        │  │  [✏️ Editar]         │ │
│                        │  └──────────────────────┘ │
└────────────────────────┴────────────────────────────┘
```

### Regular User View
```
┌─────────────────────────────────────────────────────┐
│  Repositorio de Artículos           [New] [Toggle]  │
├─────────────────────────────────────────────────────┤
│  Vista de usuario regular                            │
├────────────────────────┬────────────────────────────┤
│                        │  ┌──────────────────────┐ │
│   ☐ Status  Title      │  │   Article Details    │ │
│   ☐ ...     ...        │  │                      │ │
│   (Only Acme Corp)     │  │  Status: [Abierto]   │ │
│                        │  │  ID: issue-0001      │ │
│  [1] [2] [3]           │  │  ─────────────────   │ │
│                        │  │  Title...            │ │
│                        │  │  Company: Acme       │ │
│                        │  │  Tags: [Urgente]...  │ │
│                        │  │  Link: [🔗 Open]     │ │
│                        │  │  Description...      │ │
│                        │  │  Comments...         │ │
│                        │  │  (No Edit Button)    │ │
│                        │  └──────────────────────┘ │
└────────────────────────┴────────────────────────────┘
```

---

## 🎯 Key Features to Test

### ✅ Company Switching (Admin Only)
1. Select "Acme Corporation" from dropdown
2. See articles specific to Acme
3. Switch to "Global Tech Solutions"
4. Grid automatically updates with new articles
5. Sidebar clears (select new article to see details)

### ✅ Article Selection
1. Click any row in the grid
2. Sidebar shows complete article details:
   - Status badge (colored)
   - Article ID
   - Created and modified dates
   - Full title
   - Company name
   - Color-coded tags
   - External link (if available)
   - Full description
   - Client comments
   - Edit button (admin only)

### ✅ Role-Based Access
**As Administrator:**
- ✅ See company picker
- ✅ Can switch companies
- ✅ See all articles
- ✅ See edit button

**As Regular User:**
- ✅ Company picker hidden
- ✅ Cannot switch companies
- ✅ See only own company's articles
- ✅ No edit button

### ✅ Loading States
- Watch for loading indicator when:
  - Page first loads
  - Switching companies
  - Loading article details

---

## 📊 Test Data

### Companies Available:
1. **Acme Corporation** (co-01) - 3 articles
2. **Global Tech Solutions** (co-02) - 3 articles  
3. **Innovation Labs Inc.** (co-03) - 2 articles

### Total: 8 Articles
- 2 "Abierto" (Open)
- 3 "En progreso" (In Progress)
- 1 "Esperando" (Waiting)
- 1 "Cerrado" (Closed)
- 1 without external link

---

## 🐛 Troubleshooting

### Issue: Page doesn't load
**Solution:** Make sure DHTMLX library exists at:
```
./wwwroot/Dhtmlx/codebase/dhtmlx.js
```

### Issue: No data showing
**Solution:** Check browser console for errors. Verify mock data exists:
```
./data/articles-mock-data.json
```

### Issue: Company picker not working
**Solution:** You might be in Regular User mode. Click "Cambiar a Administrador" to switch.

### Issue: Edit button doesn't appear
**Solution:** Switch to Administrator role using the toolbar button.

---

## 📚 Next Steps

### For Users:
- Read [README.md](README.md) for complete feature documentation
- Explore all companies and articles
- Test both user roles thoroughly

### For Developers:
- Read [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) for API reference
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for architecture
- Check [VERIFICATION.md](VERIFICATION.md) for testing checklist

### For Customization:
1. **Add Companies:** Edit `data/articles-mock-data.json`
2. **Add Articles:** Add to articles array in mock data
3. **Change Colors:** Modify `articleStatusConfiguration` in `dataModels.js`
4. **Adjust Layout:** Change dimensions in `app.js`

---

## 💡 Tips

1. **Testing Both Roles:** Use the toolbar toggle button to quickly switch
2. **Inspecting Code:** Open browser DevTools (F12) to see console logs
3. **Cache Issues:** Hard refresh (Ctrl+Shift+R) if changes don't appear
4. **Performance:** Data is cached after first load for better performance

---

## ✨ What Makes This Special

- **100% DHTMLX 5.x** - No modern API used
- **Modular Code** - Easy to understand and extend
- **Descriptive Names** - Self-documenting code
- **Comprehensive Docs** - 45K+ characters of documentation
- **Production Ready** - Error handling and loading states
- **Easy Testing** - Role toggle for quick testing

---

**Enjoy your Articles Repository Application! 🎉**

Need help? Check the full documentation in the repository.
