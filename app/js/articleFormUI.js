/**
 * Article Form UI Module
 * Provides a unified form component for creating and editing articles
 * Uses DHTMLX 5.x dhtmlXForm within a dhtmlXWindow
 * 
 * Dependencies:
 * - dataModels.js (for status configuration)
 * - articleService.js (for CRUD operations)
 */

var ArticleFormUI = (function() {
  'use strict';
  
  // Form state management
  var formState = {
    currentMode: null,          // 'create' or 'edit'
    articleId: null,            // Article ID when editing
    articleWindow: null,        // DHTMLX Window instance
    articleForm: null,          // DHTMLX Form instance
    companyId: null,            // Company ID for new articles
    onSaveCallback: null,       // Callback function after save
    selectedTags: []            // Selected tags for the article
  };
  
  /**
   * Get status options from the articleStatusConfiguration defined in dataModels.js
   * This maintains a single source of truth for status values
   * @returns {Array} Array of status options for combo
   */
  function getStatusOptions() {
    // Use articleStatusConfiguration from dataModels.js (loaded globally)
    if (typeof articleStatusConfiguration !== 'undefined') {
      return Object.keys(articleStatusConfiguration).map(function(key) {
        return {
          value: key,
          text: articleStatusConfiguration[key].label
        };
      });
    }
    // Fallback if dataModels not loaded
    return [
      { value: 'Abierto', text: 'Abierto' },
      { value: 'En progreso', text: 'En progreso' },
      { value: 'Esperando', text: 'Esperando' },
      { value: 'Cerrado', text: 'Cerrado' }
    ];
  }
  
  // Form window dimensions
  var FORM_WINDOW_WIDTH = 750;
  var FORM_WINDOW_HEIGHT = 750;
  
  /**
   * Get available tag options with colors (LEGACY - for backward compatibility)
   * @returns {Array} Array of tag objects {label, color}
   * @deprecated Tags are now managed dynamically through TagPickerUI
   */
  function getAvailableTags() {
    // This function is kept for backward compatibility but is no longer used
    // Tags are now fetched dynamically from ArticleService.getTags()
    return [];
  }
  
  /**
   * Generate checkbox name from tag label
   * @param {string} tagLabel - Tag label
   * @returns {string} Checkbox name
   */
  function getTagCheckboxName(tagLabel) {
    return 'tag_' + tagLabel.replace(/\s+/g, '_').toLowerCase();
  }
  
  /**
   * Generate tag checkbox label HTML with color indicator
   * @param {string} tagLabel - Tag label
   * @param {string} tagColor - Tag color hex code
   * @returns {string} HTML string for checkbox label
   */
  function generateTagLabelHtml(tagLabel, tagColor) {
    return '<span style="display: inline-flex; align-items: center; gap: 6px;">' +
           '<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ' + tagColor + ';"></span>' +
           tagLabel + '</span>';
  }
  
  /**
   * Get the form structure configuration for dhtmlXForm
   * @param {string} mode - 'create' or 'edit'
   * @returns {Array} Form structure configuration
   */
  function getFormStructure(mode) {
    var buttonLabel = mode === 'create' ? 'Crear Artículo' : 'Guardar Cambios';
    
    return [
      {
        type: 'settings',
        position: 'label-top',
        labelWidth: 'auto',
        inputWidth: '100%',
        offsetLeft: 0,
        offsetTop: 0
      },
      {
        type: 'block',
        width: '100%',
        blockOffset: 0,
        list: [
          {
            type: 'label',
            label: '<div style="font-size: 13px; font-weight: 600; color: #262626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Título *</div>'
          },
          {
            type: 'input',
            name: 'title',
            required: true,
            inputWidth: '100%',
            style: 'margin-bottom: 16px;'
          },
          {
            type: 'label',
            label: '<div style="font-size: 13px; font-weight: 600; color: #262626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Estado</div>'
          },
          {
            type: 'combo',
            name: 'status',
            inputWidth: '100%',
            options: getStatusOptions().map(function(opt, index) {
              return {
                value: opt.value,
                text: opt.text,
                selected: index === 0
              };
            }),
            style: 'margin-bottom: 16px;'
          },
          {
            type: 'label',
            label: '<div style="font-size: 13px; font-weight: 600; color: #262626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Descripción del artículo *</div>'
          },
          {
            type: 'input',
            name: 'description',
            required: true,
            rows: 8,
            inputWidth: '100%',
            style: 'margin-bottom: 16px;'
          },
          {
            type: 'label',
            label: '<div style="font-size: 13px; font-weight: 600; color: #262626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Enlace Externo</div>'
          },
          {
            type: 'input',
            name: 'externalLink',
            inputWidth: '100%',
            style: 'margin-bottom: 16px;'
          },
          {
            type: 'label',
            label: '<div style="font-size: 13px; font-weight: 600; color: #262626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Comentarios del cliente</div>'
          },
          {
            type: 'input',
            name: 'clientComments',
            rows: 6,
            inputWidth: '100%',
            style: 'margin-bottom: 16px;'
          },
          {
            type: 'label',
            label: '<div style="font-size: 13px; font-weight: 600; color: #262626; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Etiquetas</div>'
          },
          {
            type: 'container',
            name: 'tags_container',
            inputWidth: '100%',
            style: 'margin-bottom: 16px;'
          },
          {
            type: 'block',
            width: '100%',
            blockOffset: 0,
            list: [
              {
                type: 'button',
                name: 'submit',
                value: buttonLabel,
                width: '100%'
              },
              {
                type: 'newcolumn',
                offset: 10
              },
              {
                type: 'button',
                name: 'cancel',
                value: 'Cancelar',
                width: '100%'
              }
            ]
          }
        ]
      }
    ];
  }
  
  /**
   * Create and configure the form window
   * @param {string} mode - 'create' or 'edit'
   * @param {string} articleId - Article ID (for edit mode title)
   * @returns {Object} DHTMLX Window instance
   */
  function createFormWindow(mode, articleId) {
    // Create window manager
    var dhxWins = new dhtmlXWindows();
    
    // Window title based on mode
    var windowTitle = mode === 'create' ? 'Nuevo Artículo' : 'Editando: ' + articleId;
    
    // Create and configure window (increased height to accommodate tags)
    var formWindow = dhxWins.createWindow('article_form_window', 0, 0, FORM_WINDOW_WIDTH, FORM_WINDOW_HEIGHT);
    formWindow.setText(windowTitle);
    formWindow.centerOnScreen();
    formWindow.setModal(true);
    formWindow.button('park').hide();
    formWindow.button('minmax').hide();
    
    return formWindow;
  }
  
  /**
   * Initialize the form inside the window
   * @param {Object} formWindow - DHTMLX Window instance
   * @param {string} mode - 'create' or 'edit'
   * @returns {Object} DHTMLX Form instance
   */
  function initializeForm(formWindow, mode) {
    var formStructure = getFormStructure(mode);
    var form = formWindow.attachForm(formStructure);
    
    // Attach form event handlers
    form.attachEvent('onButtonClick', function(name) {
      if (name === 'submit') {
        handleFormSubmit();
      } else if (name === 'cancel') {
        closeForm();
      }
    });
    
    // Initialize tag container with click handler
    // Using requestAnimationFrame ensures the form DOM is rendered before we attach handlers
    requestAnimationFrame(function() {
      initializeTagContainer();
    });
    
    return form;
  }
  
  /**
   * Initialize the tag container with custom UI
   */
  function initializeTagContainer() {
    if (!formState.articleForm) return;
    
    var container = formState.articleForm.getContainer('tags_container');
    if (!container) return;
    
    // Create custom tag container HTML
    var containerHtml = document.createElement('div');
    containerHtml.className = 'tag-container-wrapper';
    containerHtml.style.border = '1px solid #d9d9d9';
    containerHtml.style.borderRadius = '4px';
    containerHtml.style.padding = '12px';
    containerHtml.style.minHeight = '60px';
    containerHtml.style.cursor = 'pointer';
    containerHtml.style.transition = 'border-color 0.3s';
    
    containerHtml.innerHTML = `
      <div id="selected-tags-display" style="display: flex; flex-wrap: wrap; gap: 8px; min-height: 30px;">
        ${renderSelectedTagsBadges()}
      </div>
      <div style="margin-top: 8px; font-size: 12px; color: #8c8c8c;">
        Haz clic para seleccionar etiquetas
      </div>
    `;
    
    // Add hover effect
    containerHtml.addEventListener('mouseenter', function() {
      containerHtml.style.borderColor = '#40a9ff';
    });
    
    containerHtml.addEventListener('mouseleave', function() {
      containerHtml.style.borderColor = '#d9d9d9';
    });
    
    // Add click handler to open tag picker
    containerHtml.addEventListener('click', function() {
      openTagPickerForForm();
    });
    
    // Clear the container and add our custom HTML
    container.innerHTML = '';
    container.appendChild(containerHtml);
  }
  
  /**
   * Render selected tags as badges
   * @returns {string} HTML string for tag badges
   */
  function renderSelectedTagsBadges() {
    if (formState.selectedTags.length === 0) {
      return '<span style="color: #bfbfbf; font-size: 14px;">Ninguna etiqueta seleccionada</span>';
    }
    
    return formState.selectedTags.map(function(tag) {
      return `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white"
              style="background-color: ${tag.color}; display: inline-flex; align-items: center; gap: 6px;">
          ${escapeHtml(tag.name)}
          <button class="tag-remove-btn" data-tag-id="${escapeHtml(tag.id)}" 
                  style="background: rgba(0,0,0,0.2); border: none; border-radius: 50%; width: 16px; height: 16px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; color: white; font-size: 12px; line-height: 1;"
                  title="Eliminar etiqueta">×</button>
        </span>
      `;
    }).join('');
  }
  
  /**
   * Update the tag badges display
   */
  function updateTagBadgesDisplay() {
    var display = document.getElementById('selected-tags-display');
    if (display) {
      display.innerHTML = renderSelectedTagsBadges();
      
      // Attach event listeners to remove buttons (safer than inline onclick)
      var removeButtons = display.querySelectorAll('.tag-remove-btn');
      removeButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();  // Prevent triggering the container click
          var tagId = btn.getAttribute('data-tag-id');
          removeTag(tagId);
        });
      });
    }
  }
  
  /**
   * Open the tag picker for the form
   */
  function openTagPickerForForm() {
    if (!formState.companyId) {
      dhtmlx.alert({
        title: 'Error',
        text: 'No se pudo cargar las etiquetas'
      });
      return;
    }
    
    // Get currently selected tag IDs
    var selectedTagIds = formState.selectedTags.map(function(tag) { return tag.id; });
    
    // Open the tag picker
    TagPickerUI.openTagPicker(formState.companyId, selectedTagIds, function(selectedTags) {
      formState.selectedTags = selectedTags;
      updateTagBadgesDisplay();
    });
  }
  
  /**
   * Remove a tag from the selection
   * @param {string} tagId - Tag ID to remove
   */
  function removeTag(tagId) {
    formState.selectedTags = formState.selectedTags.filter(function(tag) {
      return tag.id !== tagId;
    });
    updateTagBadgesDisplay();
  }
  
  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  }
  
  /**
   * Validate the form data
   * @returns {boolean} True if form is valid
   */
  function validateForm() {
    if (!formState.articleForm) {
      return false;
    }
    
    var title = formState.articleForm.getItemValue('title');
    var description = formState.articleForm.getItemValue('description');
    
    if (!title || title.trim() === '') {
      dhtmlx.alert({
        title: 'Error de validación',
        text: 'El campo "Título" es obligatorio.'
      });
      return false;
    }
    
    if (!description || description.trim() === '') {
      dhtmlx.alert({
        title: 'Error de validación',
        text: 'El campo "Descripción" es obligatorio.'
      });
      return false;
    }
    
    return true;
  }
  
  /**
   * Get form data as an object
   * @returns {Object} Form data object
   */
  function getFormData() {
    if (!formState.articleForm) {
      return null;
    }
    
    // Convert selected tags to tag IDs for storage
    // Filter out any tags without IDs (for backward compatibility)
    var tagIds = formState.selectedTags
      .filter(function(tag) { return tag && tag.id; })
      .map(function(tag) { return tag.id; });
    
    return {
      title: formState.articleForm.getItemValue('title') || '',
      description: formState.articleForm.getItemValue('description') || '',
      status: formState.articleForm.getItemValue('status') || 'Abierto',
      externalLink: formState.articleForm.getItemValue('externalLink') || '',
      clientComments: formState.articleForm.getItemValue('clientComments') || '',
      companyId: formState.companyId,
      tags: tagIds  // Store tag IDs instead of tag objects
    };
  }
  
  /**
   * Handle form submission for both create and edit modes
   */
  function handleFormSubmit() {
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    var formData = getFormData();
    
    if (formState.currentMode === 'create') {
      // Create new article
      ArticleService.createArticle(formData)
        .then(function(response) {
          if (response.status === 'success') {
            dhtmlx.message({
              text: 'Artículo creado exitosamente',
              type: 'success',
              expire: 3000
            });
            
            // Call callback with new article data
            if (formState.onSaveCallback) {
              formState.onSaveCallback(response.data, 'create');
            }
            
            closeForm();
          }
        })
        .catch(function(error) {
          console.error('Error creating article:', error);
          dhtmlx.alert({
            title: 'Error',
            text: 'Error al crear el artículo: ' + error.message
          });
        });
    } else if (formState.currentMode === 'edit') {
      // Update article with new data (including tags from checkboxes)
      ArticleService.getArticleById(formState.articleId)
        .then(function(existingArticle) {
          formData.createdAt = existingArticle ? existingArticle.createdAt : null;
          
          return ArticleService.updateArticle(formState.articleId, formData);
        })
        .then(function(response) {
          if (response.status === 'success') {
            dhtmlx.message({
              text: 'Artículo actualizado exitosamente',
              type: 'success',
              expire: 3000
            });
            
            // Call callback with updated article data
            if (formState.onSaveCallback) {
              formState.onSaveCallback(response.data, 'edit');
            }
            
            closeForm();
          }
        })
        .catch(function(error) {
          console.error('Error updating article:', error);
          dhtmlx.alert({
            title: 'Error',
            text: 'Error al actualizar el artículo: ' + error.message
          });
        });
    }
  }
  
  /**
   * Close the form window and clean up
   */
  function closeForm() {
    if (formState.articleWindow) {
      formState.articleWindow.close();
    }
    
    // Reset state
    formState.currentMode = null;
    formState.articleId = null;
    formState.articleWindow = null;
    formState.articleForm = null;
    formState.companyId = null;
    formState.onSaveCallback = null;
    formState.selectedTags = [];
  }
  
  /**
   * Open the form in Create mode
   * @param {string} companyId - Company ID for the new article
   * @param {Function} onSaveCallback - Callback function after successful save
   */
  function openCreateForm(companyId, onSaveCallback) {
    // Set state for create mode
    formState.currentMode = 'create';
    formState.articleId = null;
    formState.companyId = companyId;
    formState.onSaveCallback = onSaveCallback;
    formState.selectedTags = [];  // Initialize with empty tags
    
    // Create window and form
    formState.articleWindow = createFormWindow('create', null);
    formState.articleForm = initializeForm(formState.articleWindow, 'create');
    
    // Clear form and set default status
    formState.articleForm.clear();
    
    // Set default status to "Abierto"
    var statusCombo = formState.articleForm.getCombo('status');
    if (statusCombo) {
      statusCombo.selectOption(0, true, true);
    }
  }
  
  /**
   * Open the form in Edit mode
   * @param {Object} articleData - Article object to edit
   * @param {Function} onSaveCallback - Callback function after successful save
   */
  function openEditForm(articleData, onSaveCallback) {
    if (!articleData || !articleData.id) {
      console.error('Invalid article data for edit mode');
      return;
    }
    
    // Set state for edit mode
    formState.currentMode = 'edit';
    formState.articleId = articleData.id;
    formState.companyId = articleData.companyId;
    formState.onSaveCallback = onSaveCallback;
    
    // Load tags for the company and convert article tags to tag objects
    ArticleService.getTags(articleData.companyId)
      .then(function(companyTags) {
        // Convert article's tag IDs (if they exist) to full tag objects
        formState.selectedTags = [];
        
        if (articleData.tags && Array.isArray(articleData.tags)) {
          // Check if tags are already objects (legacy format) or IDs (new format)
          if (articleData.tags.length > 0 && typeof articleData.tags[0] === 'string') {
            // New format: tags are IDs
            formState.selectedTags = companyTags.filter(function(tag) {
              return articleData.tags.indexOf(tag.id) !== -1;
            });
          } else {
            // Legacy format: tags are objects with label and color
            // Try to match them with company tags by name
            articleData.tags.forEach(function(articleTag) {
              var matchedTag = companyTags.find(function(companyTag) {
                return companyTag.name === articleTag.label;
              });
              if (matchedTag) {
                formState.selectedTags.push(matchedTag);
              }
            });
          }
        }
        
        // Create window and form
        formState.articleWindow = createFormWindow('edit', articleData.id);
        formState.articleForm = initializeForm(formState.articleWindow, 'edit');
        
        // Populate form with article data
        formState.articleForm.setItemValue('title', articleData.title || '');
        formState.articleForm.setItemValue('description', articleData.description || '');
        formState.articleForm.setItemValue('externalLink', articleData.externalLink || '');
        formState.articleForm.setItemValue('clientComments', articleData.clientComments || '');
        
        // Set status in combo
        var statusCombo = formState.articleForm.getCombo('status');
        if (statusCombo && articleData.status) {
          // Find the index of the status
          var currentStatusOptions = getStatusOptions();
          var statusIndex = currentStatusOptions.findIndex(function(opt) {
            return opt.value === articleData.status;
          });
          if (statusIndex !== -1) {
            statusCombo.selectOption(statusIndex, true, true);
          }
        }
      })
      .catch(function(error) {
        console.error('Error loading tags for edit form:', error);
        dhtmlx.alert({
          title: 'Error',
          text: 'No se pudieron cargar las etiquetas. Por favor, inténtelo de nuevo.'
        });
      });
  }
  
  /**
   * Check if the form is currently open
   * @returns {boolean} True if form window is open
   */
  function isFormOpen() {
    return formState.articleWindow !== null;
  }
  
  /**
   * Get current form mode
   * @returns {string|null} 'create', 'edit', or null if form is closed
   */
  function getCurrentMode() {
    return formState.currentMode;
  }
  
  // Public API
  return {
    openCreateForm: openCreateForm,
    openEditForm: openEditForm,
    closeForm: closeForm,
    isFormOpen: isFormOpen,
    getCurrentMode: getCurrentMode
  };
})();
