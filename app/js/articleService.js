/**
 * Article Service Module
 * Provides Promise-based data fetching methods for companies, tags, and articles
 */

const ArticleService = (function() {
  'use strict';
  
  // Cache for mock data to avoid multiple file loads
  let mockDataCache = null;
  
  /**
   * Clear the data cache (useful for development/testing)
   */
  function clearCache() {
    mockDataCache = null;
  }
  
  /**
   * Load mock data from JSON file
   * @param {boolean} forceRefresh - Force reload even if cached
   * @returns {Promise<Object>} Promise resolving to the mock data
   */
  function loadMockData(forceRefresh) {
    if (mockDataCache && !forceRefresh) {
      return Promise.resolve(mockDataCache);
    }
    
    return fetch('./data/articles-mock-data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load mock data: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        mockDataCache = data;
        return data;
      })
      .catch(error => {
        console.error('Error loading mock data:', error);
        throw error;
      });
  }
  
  /**
   * Get all companies
   * @returns {Promise<Array<Company>>} Promise resolving to array of company objects
   */
  function getCompanies() {
    return loadMockData().then(data => {
      return data.companies || [];
    });
  }
  
  /**
   * Get tags specific to a company
   * Tags are extracted from articles belonging to the company and deduplicated
   * @param {string} companyId - The company ID to filter tags by
   * @returns {Promise<Array<{label: string, color: string}>>} Promise resolving to array of unique tags
   */
  function getTagsByCompany(companyId) {
    return loadMockData().then(data => {
      const articles = data.articles || [];
      
      // Filter articles by company
      const companyArticles = articles.filter(article => article.companyId === companyId);
      
      // Extract all tags from company articles
      const allTags = [];
      companyArticles.forEach(article => {
        if (article.tags && Array.isArray(article.tags)) {
          article.tags.forEach(tag => {
            allTags.push(tag);
          });
        }
      });
      
      // Deduplicate tags by label
      const uniqueTagsMap = new Map();
      allTags.forEach(tag => {
        if (!uniqueTagsMap.has(tag.label)) {
          uniqueTagsMap.set(tag.label, tag);
        }
      });
      
      return Array.from(uniqueTagsMap.values());
    });
  }
  
  /**
   * Get articles filtered by company ID
   * @param {string} companyId - The company ID to filter articles by
   * @returns {Promise<Array<Article>>} Promise resolving to array of filtered articles
   */
  function getArticles(companyId) {
    return loadMockData().then(data => {
      const articles = data.articles || [];
      
      // Filter articles by company
      const filteredArticles = articles.filter(article => article.companyId === companyId);
      
      return filteredArticles;
    });
  }
  
  /**
   * Get a single article by ID
   * @param {string} articleId - The article ID
   * @returns {Promise<Article|null>} Promise resolving to article object or null
   */
  function getArticleById(articleId) {
    return loadMockData().then(data => {
      const articles = data.articles || [];
      const article = articles.find(article => article.id === articleId);
      return article || null;
    });
  }
  
  /**
   * Get company by ID
   * @param {string} companyId - The company ID
   * @returns {Promise<Company|null>} Promise resolving to company object or null
   */
  function getCompanyById(companyId) {
    return loadMockData().then(data => {
      const companies = data.companies || [];
      const company = companies.find(company => company.id === companyId);
      return company || null;
    });
  }
  
  /**
   * Create a new article (POST equivalent)
   * @param {Object} data - Article data object
   * @returns {Promise<{status: string, data: Article}>} Promise resolving to the created article
   */
  function createArticle(data) {
    return new Promise(function(resolve) {
      var newId = 'issue-' + Math.floor(Math.random() * 10000);
      var today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      var newRecord = Object.assign({}, data, {
        id: newId,
        createdAt: today,
        updatedAt: today
      });
      
      console.log('Creating new article:', newRecord);
      
      // Add to mock data cache if available
      if (mockDataCache && mockDataCache.articles) {
        mockDataCache.articles.push(newRecord);
      }
      
      resolve({ status: 'success', data: newRecord });
    });
  }
  
  /**
   * Update an existing article (PUT equivalent)
   * @param {string} id - Article ID to update
   * @param {Object} data - Updated article data
   * @returns {Promise<{status: string, data: Article}>} Promise resolving to the updated article
   */
  function updateArticle(id, data) {
    return new Promise(function(resolve) {
      var today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      var updatedRecord = Object.assign({}, data, {
        id: id,
        updatedAt: today
      });
      
      console.log('Updating article ' + id, updatedRecord);
      
      // Update in mock data cache if available
      if (mockDataCache && mockDataCache.articles) {
        var index = mockDataCache.articles.findIndex(function(article) {
          return article.id === id;
        });
        if (index !== -1) {
          // Preserve original createdAt
          updatedRecord.createdAt = mockDataCache.articles[index].createdAt;
          mockDataCache.articles[index] = updatedRecord;
        }
      }
      
      resolve({ status: 'success', data: updatedRecord });
    });
  }
  
  // Public API
  return {
    getCompanies: getCompanies,
    getTagsByCompany: getTagsByCompany,
    getArticles: getArticles,
    getArticleById: getArticleById,
    getCompanyById: getCompanyById,
    createArticle: createArticle,
    updateArticle: updateArticle,
    clearCache: clearCache  // Expose cache clearing for development/testing
  };
})();
