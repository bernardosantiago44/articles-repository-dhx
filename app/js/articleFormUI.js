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
    onSaveCallback: null        // Callback function after save
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
  
  /**
   * Get available tag options with colors
   * @returns {Array} Array of tag objects {label, color}
   */
  function getAvailableTags() {
    // Define standard tags available across companies
    return [
      { label: 'Urgente', color: '#ff4d4f' },
      { label: 'Bug', color: '#ffa940' },
      { label: 'Feature', color: '#1890ff' },
      { label: 'Documentation', color: '#722ed1' }
    ];
  }
  
  /**
   * Get the form structure configuration for dhtmlXForm
   * @param {string} mode - 'create' or 'edit'
   * @returns {Array} Form structure configuration
   */
  function getFormStructure(mode) {
    var buttonLabel = mode === 'create' ? 'Crear Artículo' : 'Guardar Cambios';
    var availableTags = getAvailableTags();
    
    // Build checkbox items for tags
    var tagCheckboxItems = [];
    availableTags.forEach(function(tag, index) {
      tagCheckboxItems.push({
        type: 'checkbox',
        name: 'tag_' + tag.label.replace(/\s+/g, '_').toLowerCase(),
        label: '<span style="display: inline-flex; align-items: center; gap: 6px;"><span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background-color: ' + tag.color + ';"></span>' + tag.label + '</span>',
        labelWidth: 'auto',
        style: 'margin-bottom: 8px;'
      });
    });
    
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
            type: 'block',
            width: '100%',
            blockOffset: 0,
            list: tagCheckboxItems.concat([
              {
                type: 'container',
                name: 'tags_container',
                inputWidth: '100%',
                style: 'margin-bottom: 24px;'
              }
            ])
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
    
    // Create and configure window (increased height to 650 to accommodate tags)
    var formWindow = dhxWins.createWindow('article_form_window', 0, 0, 600, 650);
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
    
    return form;
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
    
    // Collect checked tags
    var tags = [];
    var availableTags = getAvailableTags();
    availableTags.forEach(function(tag) {
      var checkboxName = 'tag_' + tag.label.replace(/\s+/g, '_').toLowerCase();
      var isChecked = formState.articleForm.isItemChecked(checkboxName);
      if (isChecked) {
        tags.push({
          label: tag.label,
          color: tag.color
        });
      }
    });
    
    return {
      title: formState.articleForm.getItemValue('title') || '',
      description: formState.articleForm.getItemValue('description') || '',
      status: formState.articleForm.getItemValue('status') || 'Abierto',
      externalLink: formState.articleForm.getItemValue('externalLink') || '',
      clientComments: formState.articleForm.getItemValue('clientComments') || '',
      companyId: formState.companyId,
      tags: tags
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
    
    // Pre-check tags based on article's existing tags
    if (articleData.tags && Array.isArray(articleData.tags)) {
      var availableTags = getAvailableTags();
      availableTags.forEach(function(tag) {
        var checkboxName = 'tag_' + tag.label.replace(/\s+/g, '_').toLowerCase();
        var isTagSelected = articleData.tags.some(function(articleTag) {
          return articleTag.label === tag.label;
        });
        if (isTagSelected) {
          formState.articleForm.setItemValue(checkboxName, true);
        }
      });
    }
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
