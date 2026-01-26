/**
 * UI Helper Module for Article Detail Sidebar
 * Provides functions to render article details in the sidebar
 * 
 * Dependencies:
 * - dataModels.js (must be loaded before this module for getStatusConfiguration function)
 */

const ArticleDetailUI = (function() {
  'use strict';
  
  /**
   * Format date from YYYY-MM-DD to a more readable format
   * @param {string} dateString - Date in YYYY-MM-DD format
   * @returns {string} Formatted date
   */
  function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  }
  
  /**
   * Render status badge HTML
   * @param {string} status - Status value
   * @param {Object} statusConfig - Status configuration
   * @returns {string} HTML for status badge
   */
  function renderStatusBadge(status, statusConfig) {
    const backgroundColor = statusConfig.color || '#8c8c8c';
    const label = statusConfig.label || status;
    
    return `
      <span style="
        display: inline-block;
        padding: 4px 12px;
        border-radius: 4px;
        background-color: ${backgroundColor};
        color: white;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
      ">${label}</span>
    `;
  }
  
  /**
   * Render tag badges HTML
   * @param {Array<{label: string, color: string}>} tags - Array of tags
   * @returns {string} HTML for tag badges container
   */
  function renderTagBadges(tags) {
    if (!tags || tags.length === 0) {
      return '<div style="font-size: 13px; color: #8c8c8c; font-style: italic;">Sin etiquetas</div>';
    }
    
    const tagsHtml = tags.map(tag => {
      return `
        <span style="
          display: inline-block;
          padding: 4px 10px;
          margin: 4px 4px 4px 0;
          border-radius: 4px;
          background-color: ${tag.color};
          color: white;
          font-size: 12px;
          font-weight: 500;
        ">${tag.label}</span>
      `;
    }).join('');
    
    return `<div style="display: flex; flex-wrap: wrap; margin-top: 8px;">${tagsHtml}</div>`;
  }
  
  /**
   * Render external link button or "no link" message
   * @param {string} externalLink - External link URL
   * @returns {string} HTML for external link section
   */
  function renderExternalLinkSection(externalLink) {
    if (!externalLink || externalLink.trim() === '') {
      return `
        <div style="
          padding: 12px;
          background-color: #f5f5f5;
          border-radius: 4px;
          color: #8c8c8c;
          font-size: 13px;
          font-style: italic;
          text-align: center;
        ">Sin enlace externo</div>
      `;
    }
    
    return `
      <a href="${externalLink}" target="_blank" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #1890ff;
        color: white;
        text-decoration: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#40a9ff'" onmouseout="this.style.backgroundColor='#1890ff'">
        Abrir enlace externo
      </a>
    `;
  }
  
  /**
   * Render a content section with title and body
   * @param {string} sectionTitle - Section title
   * @param {string} content - Section content
   * @returns {string} HTML for content section
   */
  function renderContentSection(sectionTitle, content) {
    const displayContent = content && content.trim() !== '' 
      ? content 
      : '<em style="color: #8c8c8c;">No hay información disponible</em>';
    
    return `
      <div style="margin-bottom: 20px;">
        <div style="
          font-size: 13px;
          font-weight: 600;
          color: #262626;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        ">${sectionTitle}</div>
        <div style="
          font-size: 14px;
          line-height: 1.6;
          color: #595959;
        ">${displayContent}</div>
      </div>
    `;
  }
  
  /**
   * Render the complete article detail sidebar
   * @param {Article} article - Article object with properties:
   *   - id {string}: Article ID
   *   - title {string}: Article title
   *   - description {string}: Article description
   *   - status {string}: Article status (Abierto|En progreso|Esperando|Cerrado)
   *   - tags {Array<{label: string, color: string}>}: Array of tag objects
   *   - externalLink {string}: External link URL
   *   - clientComments {string}: Client comments
   *   - createdAt {string}: Creation date (YYYY-MM-DD)
   *   - updatedAt {string}: Last update date (YYYY-MM-DD)
   * @param {string} companyName - Company name to display
   * @param {boolean} showEditButton - Whether to show edit button (true for administrators, false for regular users)
   * @returns {string} Complete HTML string for article detail sidebar
   */
  function renderArticleDetailSidebar(article, companyName, showEditButton) {
    const statusConfig = getStatusConfiguration(article.status);
    
    const editButtonHtml = showEditButton ? `
      <button id="edit-article-btn" style="
        width: 100%;
        padding: 12px;
        background-color: #52c41a;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#73d13d'" onmouseout="this.style.backgroundColor='#52c41a'">
        Editar Artículo
      </button>
    ` : '';
    
    return `
      <div style="
        padding: 20px;
        height: 100%;
        overflow-y: auto;
        box-sizing: border-box;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      ">
        <!-- Header: Status and ID -->
        <div style="margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
          ${renderStatusBadge(article.status, statusConfig)}
          <span style="font-size: 12px; color: #8c8c8c; font-weight: 500;">${article.id}</span>
        </div>
        
        <!-- Metadata: Created and Updated dates -->
        <div style="
          font-size: 12px;
          color: #8c8c8c;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e8e8e8;
        ">
          <span>Creado: ${formatDate(article.createdAt)}</span>
          <span style="margin: 0 8px;">|</span>
          <span>Modificado: ${formatDate(article.updatedAt)}</span>
        </div>
        
        <!-- Title -->
        <h2 style="
          font-size: 20px;
          font-weight: 700;
          color: #262626;
          line-height: 1.4;
          margin: 0 0 16px 0;
          word-wrap: break-word;
        ">${article.title}</h2>
        
        <!-- Context: Company Name -->
        <div style="
          font-size: 14px;
          color: #595959;
          margin-bottom: 20px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        ">
          <strong>Empresa:</strong> ${companyName}
        </div>
        
        <!-- Tags Section -->
        <div style="margin-bottom: 24px;">
          <div style="
            font-size: 13px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">Etiquetas</div>
          ${renderTagBadges(article.tags)}
        </div>
        
        <!-- External Link Section -->
        <div style="margin-bottom: 24px;">
          <div style="
            font-size: 13px;
            font-weight: 600;
            color: #262626;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">Enlace Externo</div>
          ${renderExternalLinkSection(article.externalLink)}
        </div>
        
        <!-- Description Section -->
        ${renderContentSection('Descripción del artículo', article.description)}
        
        <!-- Client Comments Section -->
        ${renderContentSection('Comentarios del cliente', article.clientComments)}
        
        <!-- Edit Button (Admin Only) -->
        ${editButtonHtml}
      </div>
    `;
  }
  
  /**
   * Render empty state for sidebar when no article is selected
   * @returns {string} HTML for empty state
   */
  function renderEmptyState() {
    return `
      <div style="
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        text-align: center;
        color: #8c8c8c;
      ">
        <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
        <div style="font-size: 16px; font-weight: 600; margin-bottom: 8px;">
          Ningún artículo seleccionado
        </div>
        <div style="font-size: 14px;">
          Seleccione un artículo de la lista para ver sus detalles
        </div>
      </div>
    `;
  }
  
  // Public API
  return {
    renderArticleDetailSidebar: renderArticleDetailSidebar,
    renderEmptyState: renderEmptyState,
    formatDate: formatDate
  };
})();
