(function () {
  'use strict';

  describe('Service: documentOrganizer', function () {
    var documentOrganizer, contentAnalyzer, directoryManager;

    // Load the module
    beforeEach(module('openSenseMapApp'));

    // Inject the services
    beforeEach(inject(function (_documentOrganizer_, _contentAnalyzer_, _directoryManager_) {
      documentOrganizer = _documentOrganizer_;
      contentAnalyzer = _contentAnalyzer_;
      directoryManager = _directoryManager_;
    }));

    describe('organizeDocument', function () {
      it('should successfully organize a valid document', function () {
        var document = {
          name: 'test-document',
          content: 'This is a sensor document about temperature and humidity measurements.',
          type: 'report'
        };

        var result = documentOrganizer.organizeDocument(document);

        expect(result).to.be.an('object');
        expect(result).to.have.property('success');
        expect(result.success).to.be.true;
        expect(result).to.have.property('document');
        expect(result).to.have.property('analysis');
        expect(result).to.have.property('targetPath');
        expect(result).to.have.property('directoryStructure');
        expect(result).to.have.property('organized');
      });

      it('should include document metadata in result', function () {
        var document = {
          name: 'technical-doc',
          content: 'This code function uses an algorithm to process API data.',
          type: 'documentation',
          path: '/original/path/doc.txt'
        };

        var result = documentOrganizer.organizeDocument(document);

        expect(result.success).to.be.true;
        expect(result.document.name).to.equal('technical-doc');
        expect(result.document.type).to.equal('documentation');
        expect(result.document.originalPath).to.equal('/original/path/doc.txt');
        expect(result.document).to.have.property('category');
        expect(result.document).to.have.property('keywords');
      });

      it('should include analysis in result', function () {
        var document = {
          content: 'The sensor measures temperature and humidity data continuously.'
        };

        var result = documentOrganizer.organizeDocument(document);

        expect(result.success).to.be.true;
        expect(result.analysis).to.have.property('classification');
        expect(result.analysis).to.have.property('keywords');
        expect(result.analysis).to.have.property('language');
        expect(result.analysis).to.have.property('sentiment');
      });

      it('should generate valid target path', function () {
        var document = {
          name: 'test',
          content: 'Business document about revenue and market strategy.'
        };

        var result = documentOrganizer.organizeDocument(document);

        expect(result.success).to.be.true;
        expect(result.targetPath).to.be.a('string');
        expect(result.targetPath).to.include('/documents');
      });

      it('should use custom options', function () {
        var document = {
          content: 'Technical documentation for API development.'
        };
        var options = {
          basePath: '/custom/docs',
          includeTimestamp: false
        };

        var result = documentOrganizer.organizeDocument(document, options);

        expect(result.success).to.be.true;
        expect(result.directoryStructure.basePath).to.equal('/custom/docs');
      });

      it('should handle documents with default values', function () {
        var document = {
          content: 'Simple document content for testing.'
        };

        var result = documentOrganizer.organizeDocument(document);

        expect(result.success).to.be.true;
        expect(result.document.name).to.equal('untitled');
        expect(result.document.type).to.equal('document');
      });

      it('should throw error for invalid document', function () {
        expect(function () {
          documentOrganizer.organizeDocument();
        }).to.throw('Invalid document: must be an object');

        expect(function () {
          documentOrganizer.organizeDocument(null);
        }).to.throw('Invalid document: must be an object');

        expect(function () {
          documentOrganizer.organizeDocument({});
        }).to.throw('Invalid document content: must be a non-empty string');
      });

      it('should return error result for processing failures', function () {
        var document = {
          content: 123 // Invalid content type
        };

        var result = documentOrganizer.organizeDocument(document);

        expect(result).to.be.an('object');
        expect(result.success).to.be.false;
        expect(result).to.have.property('error');
        expect(result).to.have.property('document');
      });
    });

    describe('organizeMultipleDocuments', function () {
      it('should organize multiple documents', function () {
        var documents = [
          { name: 'doc1', content: 'Technical documentation about code.' },
          { name: 'doc2', content: 'Business report about market strategy.' },
          { name: 'doc3', content: 'Sensor data from temperature measurements.' }
        ];

        var result = documentOrganizer.organizeMultipleDocuments(documents);

        expect(result).to.be.an('object');
        expect(result).to.have.property('total');
        expect(result).to.have.property('successful');
        expect(result).to.have.property('failed');
        expect(result).to.have.property('results');
        expect(result).to.have.property('summary');
        expect(result.total).to.equal(3);
        expect(result.results).to.have.length(3);
      });

      it('should track successful and failed documents', function () {
        var documents = [
          { name: 'doc1', content: 'Valid content here.' },
          { content: 123 }, // Invalid
          { name: 'doc3', content: 'More valid content.' }
        ];

        var result = documentOrganizer.organizeMultipleDocuments(documents);

        expect(result.total).to.equal(3);
        expect(result.successful).to.equal(2);
        expect(result.failed).to.equal(1);
      });

      it('should provide category summary', function () {
        var documents = [
          { content: 'Technical code documentation.' },
          { content: 'Technical API reference.' },
          { content: 'Business market analysis.' }
        ];

        var result = documentOrganizer.organizeMultipleDocuments(documents);

        expect(result.summary).to.be.an('object');
        expect(result.summary.technical).to.equal(2);
        expect(result.summary.business).to.equal(1);
      });

      it('should include timing information', function () {
        var documents = [
          { content: 'Test document 1.' },
          { content: 'Test document 2.' }
        ];

        var result = documentOrganizer.organizeMultipleDocuments(documents);

        expect(result).to.have.property('startTime');
        expect(result).to.have.property('endTime');
        expect(result).to.have.property('duration');
        expect(result.duration).to.be.a('number');
      });

      it('should throw error for invalid input', function () {
        expect(function () {
          documentOrganizer.organizeMultipleDocuments();
        }).to.throw('Invalid documents: must be an array');

        expect(function () {
          documentOrganizer.organizeMultipleDocuments('not an array');
        }).to.throw('Invalid documents: must be an array');
      });

      it('should handle empty array', function () {
        var result = documentOrganizer.organizeMultipleDocuments([]);

        expect(result.total).to.equal(0);
        expect(result.successful).to.equal(0);
        expect(result.failed).to.equal(0);
      });
    });

    describe('generateOrganizationPlan', function () {
      it('should generate organization plan', function () {
        var document = {
          name: 'test-doc',
          content: 'This is a technical document about software development.'
        };

        var plan = documentOrganizer.generateOrganizationPlan(document);

        expect(plan).to.be.an('object');
        expect(plan).to.have.property('document');
        expect(plan).to.have.property('analysis');
        expect(plan).to.have.property('targetPath');
        expect(plan).to.have.property('directoryTree');
        expect(plan).to.have.property('recommendations');
      });

      it('should include analysis summary', function () {
        var document = {
          content: 'Business document with revenue and market data.'
        };

        var plan = documentOrganizer.generateOrganizationPlan(document);

        expect(plan.analysis).to.have.property('category');
        expect(plan.analysis).to.have.property('confidence');
        expect(plan.analysis).to.have.property('topKeywords');
        expect(plan.analysis).to.have.property('language');
        expect(plan.analysis).to.have.property('sentiment');
        expect(plan.analysis).to.have.property('wordCount');
      });

      it('should provide directory tree preview', function () {
        var document = {
          content: 'Sensor measurements and data collection.'
        };

        var plan = documentOrganizer.generateOrganizationPlan(document);

        expect(plan.directoryTree).to.be.an('object');
        expect(plan.directoryTree).to.have.property('name');
        expect(plan.directoryTree).to.have.property('type');
        expect(plan.directoryTree).to.have.property('children');
      });

      it('should include recommendations', function () {
        var document = {
          content: 'Test content.'
        };

        var plan = documentOrganizer.generateOrganizationPlan(document);

        expect(plan.recommendations).to.be.an('array');
      });

      it('should throw error for invalid document', function () {
        expect(function () {
          documentOrganizer.generateOrganizationPlan();
        }).to.throw('Invalid document: must be an object');

        expect(function () {
          documentOrganizer.generateOrganizationPlan({});
        }).to.throw('Invalid document content: must be a non-empty string');
      });
    });

    describe('getOrganizationStats', function () {
      it('should return statistics object', function () {
        var stats = documentOrganizer.getOrganizationStats();

        expect(stats).to.be.an('object');
        expect(stats).to.have.property('totalDocuments');
        expect(stats).to.have.property('organizedDocuments');
        expect(stats).to.have.property('categories');
        expect(stats).to.have.property('lastOrganized');
        expect(stats).to.have.property('successRate');
      });

      it('should update after organizing documents', function () {
        var initialStats = documentOrganizer.getOrganizationStats();
        var initialTotal = initialStats.totalDocuments;

        var document = {
          content: 'Test document content for statistics.'
        };
        documentOrganizer.organizeDocument(document);

        var newStats = documentOrganizer.getOrganizationStats();
        expect(newStats.totalDocuments).to.equal(initialTotal + 1);
        expect(newStats.lastOrganized).to.not.be.null;
      });

      it('should track category counts', function () {
        var document = {
          content: 'Technical documentation about API development and code.'
        };
        documentOrganizer.organizeDocument(document);

        var stats = documentOrganizer.getOrganizationStats();
        expect(stats.categories).to.be.an('object');
      });
    });
  });
})();
