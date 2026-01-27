/**
 * Data Models for Articles Repository Application
 * Defines the structure for Companies and Articles
 */

/**
 * Company Data Model
 * @typedef {Object} Company
 * @property {string} id - Unique identifier for the company
 * @property {string} name - Company name
 */

/**
 * Article Data Model
 * @typedef {Object} Article
 * @property {string} id - Unique identifier (e.g., "issue-0001")
 * @property {string} title - Article title
 * @property {string} description - Detailed description of the article
 * @property {string} externalLink - External tracker link
 * @property {string} clientComments - Comments from the client
 * @property {('Producción'|'Borrador'|'Cerrado')} status - Current status
 * @property {string} companyId - Foreign key to Company
 * @property {Array<{label: string, color: string}>} tags - Company-scoped tags
 * @property {string} createdAt - Creation date (YYYY-MM-DD)
 * @property {string} updatedAt - Last update date (YYYY-MM-DD)
 */

/**
 * Status Configuration
 * Defines available statuses with their display properties
 */
const articleStatusConfiguration = {
  'Producción': {
    label: 'Producción',
    color: '#52c41a',
    bulletColor: '#52c41a'
  },
  'Borrador': {
    label: 'Borrador',
    color: '#faad14',
    bulletColor: '#faad14'
  },
  'Cerrado': {
    label: 'Cerrado',
    color: '#8c8c8c',
    bulletColor: '#8c8c8c'
  }
};

/**
 * Get status configuration for a given status value
 * @param {string} statusValue - The status value
 * @returns {Object} Status configuration object
 */
function getStatusConfiguration(statusValue) {
  return articleStatusConfiguration[statusValue] || {
    label: statusValue,
    color: '#000000',
    bulletColor: '#000000'
  };
}
