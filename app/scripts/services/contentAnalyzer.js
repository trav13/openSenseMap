(function () {
  'use strict';

  /**
   * @ngdoc service
   * @name openSenseMapApp.contentAnalyzer
   * @description
   * Service for analyzing and classifying document content.
   * This service provides AI-powered content analysis to determine
   * document types, categories, and metadata.
   */
  angular
    .module('openSenseMapApp')
    .factory('contentAnalyzer', contentAnalyzer);

  function contentAnalyzer () {
    var service = {
      analyzeContent: analyzeContent,
      classifyDocument: classifyDocument,
      extractKeywords: extractKeywords,
      detectLanguage: detectLanguage,
      analyzeSentiment: analyzeSentiment
    };

    return service;

    /**
     * Analyzes the content of a document and returns comprehensive analysis
     * @param {string} content - The document content to analyze
     * @returns {Object} Analysis results including classification, keywords, and metadata
     */
    function analyzeContent (content) {
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid content: content must be a non-empty string');
      }

      var classification = classifyDocument(content);
      var keywords = extractKeywords(content);
      var language = detectLanguage(content);
      var sentiment = analyzeSentiment(content);

      return {
        classification: classification,
        keywords: keywords,
        language: language,
        sentiment: sentiment,
        wordCount: content.split(/\s+/).filter(function (word) { return word.length > 0; }).length,
        characterCount: content.length,
        timestamp: new Date().toISOString()
      };
    }

    /**
     * Classifies a document into predefined categories
     * @param {string} content - The document content to classify
     * @returns {Object} Classification results with category and confidence
     */
    function classifyDocument (content) {
      if (!content || typeof content !== 'string') {
        throw new Error('Invalid content for classification');
      }

      var contentLower = content.toLowerCase();
      var categories = {
        technical: ['code', 'function', 'class', 'variable', 'api', 'algorithm', 'debug', 'error'],
        scientific: ['research', 'study', 'hypothesis', 'experiment', 'data', 'analysis', 'methodology'],
        business: ['revenue', 'profit', 'market', 'customer', 'strategy', 'sales', 'financial'],
        legal: ['contract', 'agreement', 'clause', 'law', 'regulation', 'compliance', 'terms'],
        educational: ['learn', 'teach', 'course', 'lesson', 'tutorial', 'guide', 'instruction'],
        sensor: ['sensor', 'measurement', 'temperature', 'humidity', 'box', 'sensebox', 'opensensemap'],
        general: []
      };

      var scores = {};
      var maxScore = 0;
      var bestCategory = 'general';

      // Score each category based on keyword presence
      for (var category in categories) {
        if (categories.hasOwnProperty(category)) {
          var score = 0;
          var keywords = categories[category];
          for (var i = 0; i < keywords.length; i++) {
            var regex = new RegExp('\\b' + keywords[i] + '\\b', 'gi');
            var matches = contentLower.match(regex);
            if (matches) {
              score = score + matches.length;
            }
          }
          scores[category] = score;
          if (score > maxScore) {
            maxScore = score;
            bestCategory = category;
          }
        }
      }

      var totalScore = Object.keys(scores).reduce(function (sum, key) {
        return sum + scores[key];
      }, 0);

      var confidence = totalScore > 0 ? (maxScore / totalScore) : 0;

      return {
        category: bestCategory,
        confidence: confidence,
        scores: scores
      };
    }

    /**
     * Extracts keywords from document content
     * @param {string} content - The document content
     * @returns {Array} Array of keywords sorted by frequency
     */
    function extractKeywords (content) {
      if (!content || typeof content !== 'string') {
        return [];
      }

      // Common stop words to filter out
      var stopWords = [
        'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
        'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
        'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
        'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'is'
      ];

      // Extract words and count frequency
      var words = content.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(function (word) {
          return word.length > 3 && stopWords.indexOf(word) === -1;
        });

      var wordFreq = {};
      words.forEach(function (word) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });

      // Sort by frequency and return top keywords
      var sortedWords = Object.keys(wordFreq).sort(function (a, b) {
        return wordFreq[b] - wordFreq[a];
      });

      return sortedWords.slice(0, 10).map(function (word) {
        return {
          word: word,
          frequency: wordFreq[word]
        };
      });
    }

    /**
     * Detects the language of the content
     * @param {string} content - The document content
     * @returns {Object} Language detection results
     */
    function detectLanguage (content) {
      if (!content || typeof content !== 'string') {
        return { language: 'unknown', confidence: 0 };
      }

      var contentLower = content.toLowerCase();

      // Simple language detection based on common words
      var languageIndicators = {
        english: ['the', 'and', 'is', 'in', 'to', 'of', 'that', 'for'],
        german: ['der', 'die', 'das', 'und', 'ist', 'in', 'den', 'von'],
        spanish: ['el', 'la', 'de', 'que', 'y', 'en', 'un', 'ser'],
        french: ['le', 'de', 'un', 'être', 'et', 'à', 'il', 'avoir']
      };

      var scores = {};
      var maxScore = 0;
      var detectedLang = 'unknown';

      for (var lang in languageIndicators) {
        if (languageIndicators.hasOwnProperty(lang)) {
          var score = 0;
          var indicators = languageIndicators[lang];
          for (var i = 0; i < indicators.length; i++) {
            var regex = new RegExp('\\b' + indicators[i] + '\\b', 'g');
            var matches = contentLower.match(regex);
            if (matches) {
              score = score + matches.length;
            }
          }
          scores[lang] = score;
          if (score > maxScore) {
            maxScore = score;
            detectedLang = lang;
          }
        }
      }

      var totalScore = Object.keys(scores).reduce(function (sum, key) {
        return sum + scores[key];
      }, 0);

      return {
        language: detectedLang,
        confidence: totalScore > 0 ? (maxScore / totalScore) : 0,
        scores: scores
      };
    }

    /**
     * Analyzes the sentiment of the content
     * @param {string} content - The document content
     * @returns {Object} Sentiment analysis results
     */
    function analyzeSentiment (content) {
      if (!content || typeof content !== 'string') {
        return { sentiment: 'neutral', score: 0 };
      }

      var contentLower = content.toLowerCase();

      // Simple sentiment word lists
      var positiveWords = [
        'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
        'positive', 'success', 'win', 'happy', 'love', 'best', 'perfect'
      ];

      var negativeWords = [
        'bad', 'terrible', 'awful', 'horrible', 'negative', 'fail', 'failed',
        'error', 'problem', 'issue', 'wrong', 'worst', 'hate', 'poor'
      ];

      var positiveScore = 0;
      var negativeScore = 0;

      positiveWords.forEach(function (word) {
        var regex = new RegExp('\\b' + word + '\\b', 'g');
        var matches = contentLower.match(regex);
        if (matches) {
          positiveScore = positiveScore + matches.length;
        }
      });

      negativeWords.forEach(function (word) {
        var regex = new RegExp('\\b' + word + '\\b', 'g');
        var matches = contentLower.match(regex);
        if (matches) {
          negativeScore = negativeScore + matches.length;
        }
      });

      var totalScore = positiveScore + negativeScore;
      var sentimentScore = totalScore > 0 ? (positiveScore - negativeScore) / totalScore : 0;

      var sentiment = 'neutral';
      if (sentimentScore > 0.2) {
        sentiment = 'positive';
      } else if (sentimentScore < -0.2) {
        sentiment = 'negative';
      }

      return {
        sentiment: sentiment,
        score: sentimentScore,
        positiveCount: positiveScore,
        negativeCount: negativeScore
      };
    }
  }
})();
