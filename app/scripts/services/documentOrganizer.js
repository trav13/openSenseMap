(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name openSenseMapApp.documentOrganizer
   * @description
   * Main service for AI-powered document organization.
   * This service orchestrates content analysis and directory management
   * to automatically organize documents.
   */
  angular
    .module('openSenseMapApp')
    .factory('documentOrganizer', documentOrganizer);

  documentOrganizer.$inject = ['contentAnalyzer', 'directoryManager'];

  function documentOrganizer (contentAnalyzer, directoryManager) {
    var service = {
      organizeDocument: organizeDocument,
      organizeMultipleDocuments: organizeMultipleDocuments,
      generateOrganizationPlan: generateOrganizationPlan,
      getOrganizationStats: getOrganizationStats
    };

    // Statistics tracking
    var stats = {
      totalDocuments: 0,
      organizedDocuments: 0,
      categories: {},
      lastOrganized: null
    };

    return service;

    /**
     * Organizes a single document by analyzing its content and determining placement
     * @param {Object} doc - Document object with content and metadata
     * @param {Object} options - Organization options
     * @returns {Object} Organization result
     */
    function organizeDocument (doc, options) {
      if (!doc || typeof doc !== 'object') {
        throw new Error('Invalid document: must be an object');
      }

      if (!doc.content || typeof doc.content !== 'string') {
        throw new Error('Invalid document content: must be a non-empty string');
      }

      options = options || {};

      try {
        // Analyze the document content
        var analysis = contentAnalyzer.analyzeContent(doc.content);

        // Generate document metadata
        var documentMetadata = {
          name: doc.name || 'untitled',
          category: analysis.classification.category,
          type: doc.type || 'document',
          date: doc.date || new Date(),
          keywords: analysis.keywords,
          language: analysis.language.language,
          sentiment: analysis.sentiment.sentiment,
          wordCount: analysis.wordCount,
          originalPath: doc.path || null
        };

        // Generate target path
        var targetPath = directoryManager.generatePath(documentMetadata);

        // Validate the path
        var pathValidation = directoryManager.validatePath(targetPath);
        if (!pathValidation.valid) {
          throw new Error('Generated path is invalid: ' + pathValidation.errors.join(', '));
        }

        // Create directory structure
        var directoryStructure = directoryManager.createDirectoryStructure(
          analysis.classification.category,
          {
            basePath: options.basePath || '/documents',
            includeTimestamp: options.includeTimestamp
          }
        );

        // Update statistics
        updateStats(analysis.classification.category);

        var result = {
          success: true,
          document: documentMetadata,
          analysis: analysis,
          targetPath: targetPath,
          directoryStructure: directoryStructure,
          organized: new Date().toISOString()
        };

        stats.lastOrganized = result;

        return result;
      } catch (error) {
        stats.totalDocuments = stats.totalDocuments + 1;

        return {
          success: false,
          error: error.message,
          document: {
            name: doc.name || 'untitled',
            originalPath: doc.path || null
          }
        };
      }
    }

    /**
     * Organizes multiple documents in batch
     * @param {Array} documents - Array of document objects
     * @param {Object} options - Organization options
     * @returns {Object} Batch organization results
     */
    function organizeMultipleDocuments (documents, options) {
      if (!Array.isArray(documents)) {
        throw new Error('Invalid documents: must be an array');
      }

      options = options || {};
      var results = {
        total: documents.length,
        successful: 0,
        failed: 0,
        results: [],
        summary: {},
        startTime: new Date().toISOString()
      };

      documents.forEach(function (doc) {
        var result = organizeDocument(doc, options);
        results.results.push(result);

        if (result.success) {
          results.successful++;
          var category = result.analysis.classification.category;
          results.summary[category] = (results.summary[category] || 0) + 1;
        } else {
          results.failed++;
        }
      });

      results.endTime = new Date().toISOString();
      var startMs = new Date(results.startTime).getTime();
      var endMs = new Date(results.endTime).getTime();
      results.duration = (endMs - startMs) / 1000;

      return results;
    }

    /**
     * Generates an organization plan without actually organizing
     * @param {Object} doc - Document to plan organization for
     * @returns {Object} Organization plan
     */
    function generateOrganizationPlan (doc) {
      if (!doc || typeof doc !== 'object') {
        throw new Error('Invalid document: must be an object');
      }

      if (!doc.content || typeof doc.content !== 'string') {
        throw new Error('Invalid document content: must be a non-empty string');
      }

      // Analyze content
      var analysis = contentAnalyzer.analyzeContent(doc.content);

      // Generate metadata
      var documentMetadata = {
        name: doc.name || 'untitled',
        category: analysis.classification.category,
        type: doc.type || 'document',
        date: doc.date || new Date()
      };

      // Generate path
      var targetPath = directoryManager.generatePath(documentMetadata);

      // Create directory structure preview
      var directoryStructure = directoryManager.createDirectoryStructure(
        analysis.classification.category,
        { basePath: '/documents' }
      );

      var tree = directoryManager.getDirectoryTree(directoryStructure);

      return {
        document: documentMetadata,
        analysis: {
          category: analysis.classification.category,
          confidence: analysis.classification.confidence,
          topKeywords: analysis.keywords.slice(0, 5),
          language: analysis.language.language,
          sentiment: analysis.sentiment.sentiment,
          wordCount: analysis.wordCount
        },
        targetPath: targetPath,
        directoryTree: tree,
        recommendations: generateRecommendations(analysis)
      };
    }

    /**
     * Gets organization statistics
     * @returns {Object} Statistics object
     */
    function getOrganizationStats () {
      return {
        totalDocuments: stats.totalDocuments,
        organizedDocuments: stats.organizedDocuments,
        categories: stats.categories,
        lastOrganized: stats.lastOrganized,
        successRate: stats.totalDocuments > 0
          ? (stats.organizedDocuments / stats.totalDocuments * 100).toFixed(2) + '%'
          : 'N/A'
      };
    }

    /**
     * Updates statistics after organizing a document
     * @private
     */
    function updateStats (category) {
      stats.totalDocuments++;
      stats.organizedDocuments++;
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    }

    /**
     * Generates recommendations based on analysis
     * @private
     */
    function generateRecommendations (analysis) {
      var recommendations = [];

      // Confidence-based recommendations
      if (analysis.classification.confidence < 0.3) {
        recommendations.push({
          type: 'warning',
          message: 'Low classification confidence. Consider manual review.',
          confidence: analysis.classification.confidence
        });
      } else if (analysis.classification.confidence > 0.7) {
        recommendations.push({
          type: 'success',
          message: 'High classification confidence. Automatic organization recommended.',
          confidence: analysis.classification.confidence
        });
      }

      // Content length recommendations
      if (analysis.wordCount < 50) {
        recommendations.push({
          type: 'info',
          message: 'Short document. Classification may be less accurate.',
          wordCount: analysis.wordCount
        });
      }

      // Language recommendations
      if (analysis.language.confidence < 0.5) {
        recommendations.push({
          type: 'warning',
          message: 'Uncertain language detection. Manual verification suggested.',
          detectedLanguage: analysis.language.language
        });
      }

      return recommendations;
    }
  }
})();
