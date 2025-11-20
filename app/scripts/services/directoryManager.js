(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name openSenseMapApp.directoryManager
   * @description
   * Service for managing directory structures for document organization.
   * This service handles creation, validation, and management of directory hierarchies.
   */
  angular
    .module('openSenseMapApp')
    .factory('directoryManager', directoryManager);

  function directoryManager () {
    var service = {
      createDirectoryStructure: createDirectoryStructure,
      validatePath: validatePath,
      generatePath: generatePath,
      normalizeDirectoryName: normalizeDirectoryName,
      getDirectoryTree: getDirectoryTree
    };

    // Default directory structure template
    var defaultStructure = {
      technical: ['code', 'documentation', 'configuration', 'scripts'],
      scientific: ['research', 'data', 'analysis', 'publications'],
      business: ['reports', 'presentations', 'proposals', 'contracts'],
      legal: ['contracts', 'agreements', 'compliance', 'policies'],
      educational: ['courses', 'tutorials', 'guides', 'exercises'],
      sensor: ['measurements', 'calibration', 'metadata', 'reports'],
      general: ['documents', 'misc']
    };

    return service;

    /**
     * Creates a directory structure based on category
     * @param {string} category - The category for which to create structure
     * @param {Object} options - Optional configuration
     * @returns {Object} Directory structure information
     */
    function createDirectoryStructure (category, options) {
      if (!category || typeof category !== 'string') {
        throw new Error('Invalid category: category must be a non-empty string');
      }

      options = options || {};
      var basePath = options.basePath || '/documents';
      var includeTimestamp = options.includeTimestamp !== false;
      var customSubdirs = options.subdirectories || defaultStructure[category] || defaultStructure.general;

      var normalizedCategory = normalizeDirectoryName(category);
      var timestamp = includeTimestamp ? new Date().toISOString()
        .split('T')[0] : '';

      var categoryPath = basePath + '/' + normalizedCategory;
      if (timestamp) {
        categoryPath = categoryPath + ('/' + timestamp);
      }

      var structure = {
        basePath: basePath,
        categoryPath: categoryPath,
        subdirectories: customSubdirs.map(function (subdir) {
          return categoryPath + '/' + normalizeDirectoryName(subdir);
        }),
        created: new Date().toISOString()
      };

      return structure;
    }

    /**
     * Validates a directory path
     * @param {string} path - The path to validate
     * @returns {Object} Validation result
     */
    function validatePath (path) {
      if (!path || typeof path !== 'string') {
        return {
          valid: false,
          errors: ['Path must be a non-empty string']
        };
      }

      var errors = [];

      // Check for invalid characters
      // eslint-disable-next-line no-control-regex
      var invalidChars = /[<>:"|?*\x00-\x1F]/;
      if (invalidChars.test(path)) {
        errors.push('Path contains invalid characters');
      }

      // Check for path traversal attempts
      if (path.indexOf('..') !== -1) {
        errors.push('Path contains directory traversal sequences');
      }

      // Check path length (common limit is 260 on Windows, 4096 on Unix)
      if (path.length > 255) {
        errors.push('Path exceeds maximum length');
      }

      // Check for reserved names (Windows)
      var reservedNames = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
      var pathParts = path.split('/');
      for (var i = 0; i < pathParts.length; i++) {
        var part = pathParts[i].split('.')[0];
        if (reservedNames.test(part)) {
          errors.push('Path contains reserved system names');
          break;
        }
      }

      return {
        valid: errors.length === 0,
        errors: errors
      };
    }

    /**
     * Generates a path for a document based on its metadata
     * @param {Object} documentMetadata - Document metadata including category, type, etc.
     * @returns {string} Generated path
     */
    function generatePath (documentMetadata) {
      if (!documentMetadata || typeof documentMetadata !== 'object') {
        throw new Error('Invalid documentMetadata: must be an object');
      }

      var category = documentMetadata.category || 'general';
      var type = documentMetadata.type || 'document';
      var name = documentMetadata.name || 'untitled';
      var date = documentMetadata.date ? new Date(documentMetadata.date) : new Date();

      var basePath = '/documents';
      var categoryDir = normalizeDirectoryName(category);
      var year = date.getFullYear();
      var month = String(date.getMonth() + 1).padStart(2, '0');
      var typeDir = normalizeDirectoryName(type);
      var fileName = normalizeDirectoryName(name);

      var path = basePath + '/' + categoryDir + '/' + year + '/' + month + '/' + typeDir + '/' + fileName;

      return path;
    }

    /**
     * Normalizes a directory name by removing invalid characters
     * @param {string} name - The name to normalize
     * @returns {string} Normalized name
     */
    function normalizeDirectoryName (name) {
      if (!name || typeof name !== 'string') {
        return 'untitled';
      }

      return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-_]/g, '') // Remove invalid characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }

    /**
     * Gets a tree representation of a directory structure
     * @param {Object} structure - The directory structure
     * @returns {Object} Tree representation
     */
    function getDirectoryTree (structure) {
      if (!structure || typeof structure !== 'object') {
        throw new Error('Invalid structure: must be an object');
      }

      var tree = {
        name: structure.basePath || 'documents',
        type: 'directory',
        path: structure.basePath || '/documents',
        children: []
      };

      if (structure.categoryPath) {
        var categoryNode = {
          name: structure.categoryPath.split('/').pop(),
          type: 'directory',
          path: structure.categoryPath,
          children: []
        };

        if (structure.subdirectories && Array.isArray(structure.subdirectories)) {
          structure.subdirectories.forEach(function (subdir) {
            categoryNode.children.push({
              name: subdir.split('/').pop(),
              type: 'directory',
              path: subdir,
              children: []
            });
          });
        }

        tree.children.push(categoryNode);
      }

      return tree;
    }
  }
})();
