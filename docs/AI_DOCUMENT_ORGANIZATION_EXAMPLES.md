# AI Document Organization System - Usage Examples

This file contains practical examples demonstrating how to use the AI Document Organization System.

## Example 1: Basic Document Organization

```javascript
(function() {
  'use strict';

  angular
    .module('openSenseMapApp')
    .controller('DocumentOrganizerExample', DocumentOrganizerExample);

  DocumentOrganizerExample.$inject = ['documentOrganizer'];

  function DocumentOrganizerExample(documentOrganizer) {
    var vm = this;

    // Sample documents
    vm.sampleDocuments = [
      {
        name: 'temperature-sensor-report',
        content: 'The senseBox sensor has been monitoring temperature and humidity ' +
                'levels across multiple locations in the openSenseMap network. ' +
                'Data collected shows consistent measurements with high accuracy.',
        type: 'report',
        date: new Date('2024-01-15')
      },
      {
        name: 'api-documentation',
        content: 'This document provides technical documentation for the API endpoints. ' +
                'The function implementations include error handling and debugging capabilities. ' +
                'Code examples demonstrate proper usage of the algorithm.',
        type: 'documentation',
        date: new Date('2024-02-20')
      },
      {
        name: 'market-analysis',
        content: 'Quarterly business report showing revenue growth and market expansion. ' +
                'Customer acquisition strategy has proven successful with increasing sales. ' +
                'Financial projections remain positive for the upcoming quarter.',
        type: 'report',
        date: new Date('2024-03-10')
      }
    ];

    vm.organizeDocument = organizeDocument;
    vm.organizeAll = organizeAll;
    vm.previewOrganization = previewOrganization;
    vm.getStats = getStats;

    // Organize a single document
    function organizeDocument(doc) {
      try {
        var result = documentOrganizer.organizeDocument(doc);
        
        if (result.success) {
          console.log('✓ Successfully organized: ' + doc.name);
          console.log('  Category: ' + result.analysis.classification.category);
          console.log('  Confidence: ' + (result.analysis.classification.confidence * 100).toFixed(1) + '%');
          console.log('  Target Path: ' + result.targetPath);
          console.log('  Language: ' + result.analysis.language.language);
          console.log('  Sentiment: ' + result.analysis.sentiment.sentiment);
          console.log('  Word Count: ' + result.analysis.wordCount);
          console.log('  Top Keywords:', result.analysis.keywords.slice(0, 3).map(function(k) {
            return k.word;
          }).join(', '));
        } else {
          console.error('✗ Failed to organize: ' + doc.name);
          console.error('  Error: ' + result.error);
        }
        
        return result;
      } catch (error) {
        console.error('Exception occurred:', error.message);
        return null;
      }
    }

    // Organize all documents in batch
    function organizeAll() {
      console.log('Starting batch organization...');
      console.log('-----------------------------------');
      
      var results = documentOrganizer.organizeMultipleDocuments(vm.sampleDocuments);
      
      console.log('\nBatch Organization Results:');
      console.log('  Total Documents: ' + results.total);
      console.log('  Successful: ' + results.successful);
      console.log('  Failed: ' + results.failed);
      console.log('  Duration: ' + results.duration.toFixed(2) + ' seconds');
      console.log('\nCategory Summary:');
      
      Object.keys(results.summary).forEach(function(category) {
        console.log('  ' + category + ': ' + results.summary[category]);
      });
      
      return results;
    }

    // Preview organization without applying changes
    function previewOrganization(doc) {
      console.log('Previewing organization for: ' + doc.name);
      console.log('-----------------------------------');
      
      var plan = documentOrganizer.generateOrganizationPlan(doc);
      
      console.log('Document Analysis:');
      console.log('  Name: ' + plan.document.name);
      console.log('  Category: ' + plan.analysis.category);
      console.log('  Confidence: ' + (plan.analysis.confidence * 100).toFixed(1) + '%');
      console.log('  Language: ' + plan.analysis.language);
      console.log('  Sentiment: ' + plan.analysis.sentiment);
      console.log('  Word Count: ' + plan.analysis.wordCount);
      
      console.log('\nTop Keywords:');
      plan.analysis.topKeywords.forEach(function(keyword, index) {
        console.log('  ' + (index + 1) + '. ' + keyword.word + ' (freq: ' + keyword.frequency + ')');
      });
      
      console.log('\nTarget Path: ' + plan.targetPath);
      
      console.log('\nRecommendations:');
      if (plan.recommendations.length === 0) {
        console.log('  No specific recommendations');
      } else {
        plan.recommendations.forEach(function(rec) {
          console.log('  [' + rec.type.toUpperCase() + '] ' + rec.message);
        });
      }
      
      return plan;
    }

    // Get organization statistics
    function getStats() {
      var stats = documentOrganizer.getOrganizationStats();
      
      console.log('Organization Statistics:');
      console.log('-----------------------------------');
      console.log('Total Documents: ' + stats.totalDocuments);
      console.log('Organized Documents: ' + stats.organizedDocuments);
      console.log('Success Rate: ' + stats.successRate);
      
      console.log('\nDocuments by Category:');
      Object.keys(stats.categories).forEach(function(category) {
        console.log('  ' + category + ': ' + stats.categories[category]);
      });
      
      if (stats.lastOrganized) {
        console.log('\nLast Organized Document:');
        console.log('  Name: ' + stats.lastOrganized.document.name);
        console.log('  Category: ' + stats.lastOrganized.document.category);
        console.log('  Time: ' + stats.lastOrganized.organized);
      }
      
      return stats;
    }

    // Auto-run demo on controller initialization (optional)
    function runDemo() {
      console.log('\n=== AI Document Organization System Demo ===\n');
      
      // Preview first document
      console.log('1. PREVIEW ORGANIZATION');
      previewOrganization(vm.sampleDocuments[0]);
      
      console.log('\n\n2. ORGANIZE SINGLE DOCUMENT');
      organizeDocument(vm.sampleDocuments[1]);
      
      console.log('\n\n3. BATCH ORGANIZE ALL DOCUMENTS');
      organizeAll();
      
      console.log('\n\n4. VIEW STATISTICS');
      getStats();
      
      console.log('\n=== Demo Complete ===\n');
    }

    // Uncomment to auto-run demo
    // runDemo();
  }
})();
```

## Example 2: Content Analysis Only

```javascript
(function() {
  'use strict';

  angular
    .module('openSenseMapApp')
    .controller('ContentAnalysisExample', ContentAnalysisExample);

  ContentAnalysisExample.$inject = ['contentAnalyzer'];

  function ContentAnalysisExample(contentAnalyzer) {
    var vm = this;

    vm.analyzeSample = function() {
      var sampleText = 'The senseBox sensor continuously monitors environmental ' +
                      'data including temperature, humidity, and air quality. ' +
                      'Measurements are transmitted to the openSenseMap platform ' +
                      'for visualization and analysis.';

      // Comprehensive analysis
      var analysis = contentAnalyzer.analyzeContent(sampleText);
      console.log('Full Analysis:', analysis);

      // Individual analyses
      var classification = contentAnalyzer.classifyDocument(sampleText);
      console.log('Classification:', classification);

      var keywords = contentAnalyzer.extractKeywords(sampleText);
      console.log('Keywords:', keywords);

      var language = contentAnalyzer.detectLanguage(sampleText);
      console.log('Language:', language);

      var sentiment = contentAnalyzer.analyzeSentiment(sampleText);
      console.log('Sentiment:', sentiment);
    };
  }
})();
```

## Example 3: Directory Management

```javascript
(function() {
  'use strict';

  angular
    .module('openSenseMapApp')
    .controller('DirectoryManagementExample', DirectoryManagementExample);

  DirectoryManagementExample.$inject = ['directoryManager'];

  function DirectoryManagementExample(directoryManager) {
    var vm = this;

    vm.createStructures = function() {
      // Create directory structure for different categories
      var categories = ['technical', 'sensor', 'business'];
      
      categories.forEach(function(category) {
        var structure = directoryManager.createDirectoryStructure(category, {
          basePath: '/organized-documents',
          includeTimestamp: true
        });
        
        console.log('Structure for ' + category + ':', structure);
        
        // Get tree representation
        var tree = directoryManager.getDirectoryTree(structure);
        console.log('Tree:', tree);
      });
    };

    vm.validatePaths = function() {
      var testPaths = [
        '/documents/technical/2024/report.pdf',  // Valid
        '/documents/../etc/passwd',               // Invalid - traversal
        '/documents/test<>file.txt',              // Invalid - bad chars
        '/documents/CON/file.txt'                 // Invalid - reserved name
      ];

      testPaths.forEach(function(path) {
        var validation = directoryManager.validatePath(path);
        console.log('Path:', path);
        console.log('Valid:', validation.valid);
        if (!validation.valid) {
          console.log('Errors:', validation.errors);
        }
        console.log('---');
      });
    };

    vm.generatePaths = function() {
      var documents = [
        { 
          category: 'technical', 
          type: 'code', 
          name: 'MyComponent.js',
          date: new Date('2024-01-15')
        },
        { 
          category: 'sensor', 
          type: 'measurement', 
          name: 'Temperature Data',
          date: new Date('2024-02-20')
        }
      ];

      documents.forEach(function(doc) {
        var path = directoryManager.generatePath(doc);
        console.log('Generated path for ' + doc.name + ':', path);
      });
    };

    vm.createDetailedStructure = function() {
      // Create detailed hierarchical structure for IT infrastructure
      var detailedStructure = directoryManager.createDetailedStructure(
        'infrastructure', 
        'Desktop_Architecture_And_Engineering',
        { basePath: '/IT_Documentation' }
      );

      console.log('Detailed Infrastructure Structure:');
      console.log('Base Path:', detailedStructure.basePath);
      console.log('Category Path:', detailedStructure.categoryPath);
      console.log('Hierarchy:', JSON.stringify(detailedStructure.hierarchy, null, 2));

      // Create detailed structure for medical category
      var medicalStructure = directoryManager.createDetailedStructure(
        'medical',
        null,
        { basePath: '/Healthcare_Documents' }
      );

      console.log('\nMedical Structure:');
      console.log('Hierarchy:', JSON.stringify(medicalStructure.hierarchy, null, 2));
    };
  }
})();
```

## Example 4: IT Infrastructure Document Organization

```javascript
(function() {
  'use strict';

  angular
    .module('openSenseMapApp')
    .controller('ITInfrastructureExample', ITInfrastructureExample);

  ITInfrastructureExample.$inject = ['documentOrganizer', 'directoryManager'];

  function ITInfrastructureExample(documentOrganizer, directoryManager) {
    var vm = this;

    vm.organizeITDocuments = function() {
      // Example IT infrastructure documents
      var itDocuments = [
        {
          name: 'Windows_11_Migration_Plan',
          content: 'Desktop architecture deployment infrastructure SCCM Intune Windows 11 imaging provisioning task sequences enrollment standards.',
          type: 'project_plan'
        },
        {
          name: 'Cerner_Client_Configuration',
          content: 'Medical Cerner clinical application Citrix healthcare patient EHR Dragon Dictation configuration profiles.',
          type: 'configuration'
        },
        {
          name: 'PowerShell_Automation_Scripts',
          content: 'PowerShell automation deployment scripts infrastructure Active Directory Group Policy packaging health checks.',
          type: 'scripts'
        }
      ];

      console.log('Organizing IT Infrastructure Documents...\n');

      itDocuments.forEach(function(doc) {
        var result = documentOrganizer.organizeDocument(doc);

        if (result.success) {
          console.log('✓ Document:', doc.name);
          console.log('  Category:', result.analysis.classification.category);
          console.log('  Confidence:', (result.analysis.classification.confidence * 100).toFixed(1) + '%');
          console.log('  Target Path:', result.targetPath);
          console.log('  Top Keywords:', result.analysis.keywords.slice(0, 3).map(function(k) {
            return k.word;
          }).join(', '));
          console.log('');
        }
      });

      // Create detailed directory structure
      console.log('\nCreating Detailed Infrastructure Structure...');
      var detailedStructure = directoryManager.createDetailedStructure(
        'infrastructure',
        'Desktop_Architecture_And_Engineering'
      );

      console.log('Structure includes:');
      console.log('- Standards (Windows 11, Hardware, Naming Conventions, OU/VLAN)');
      console.log('- Imaging & Provisioning (SCCM, Intune, Drivers, Checklists)');
      console.log('- Application Stacks (TrackingBoard, Dragon, Cerner)');
      console.log('- Tools & Scripts (PowerShell, Packaging, Health Checks)');
      console.log('- Project Specific (MHN Pilot, Windows 11 Migration, Clinic Rollouts)');
    };
  }
})();
```

## Running the Examples

### In Browser Console

1. Open your browser's developer console
2. Access the controller instance
3. Call the example methods:

```javascript
// Assuming you've added the example controller to your app
var scope = angular.element(document.body).scope();
var ctrl = angular.element(document.querySelector('[ng-controller="DocumentOrganizerExample"]')).scope().vm;

// Run individual methods
ctrl.previewOrganization(ctrl.sampleDocuments[0]);
ctrl.organizeAll();
ctrl.getStats();
```

### In Unit Tests

```javascript
describe('Document Organization Examples', function() {
  var documentOrganizer;

  beforeEach(module('openSenseMapApp'));
  beforeEach(inject(function(_documentOrganizer_) {
    documentOrganizer = _documentOrganizer_;
  }));

  it('should organize a sensor document', function() {
    var doc = {
      name: 'test-sensor-data',
      content: 'Sensor measurements from senseBox including temperature data'
    };

    var result = documentOrganizer.organizeDocument(doc);

    expect(result.success).to.be.true;
    expect(result.analysis.classification.category).to.equal('sensor');
  });
});
```

## Sample Output

When running the examples, you should see output similar to:

```
=== AI Document Organization System Demo ===

1. PREVIEW ORGANIZATION
Previewing organization for: temperature-sensor-report
-----------------------------------
Document Analysis:
  Name: temperature-sensor-report
  Category: sensor
  Confidence: 75.2%
  Language: english
  Sentiment: neutral
  Word Count: 25

Top Keywords:
  1. sensor (freq: 2)
  2. temperature (freq: 1)
  3. humidity (freq: 1)

Target Path: /documents/sensor/2024/01/report/temperature-sensor-report

Recommendations:
  No specific recommendations


2. ORGANIZE SINGLE DOCUMENT
✓ Successfully organized: api-documentation
  Category: technical
  Confidence: 82.1%
  Target Path: /documents/technical/2024/02/documentation/api-documentation
  Language: english
  Sentiment: neutral
  Word Count: 22
  Top Keywords: technical, documentation, function


3. BATCH ORGANIZE ALL DOCUMENTS
Starting batch organization...
-----------------------------------

Batch Organization Results:
  Total Documents: 3
  Successful: 3
  Failed: 0
  Duration: 0.05 seconds

Category Summary:
  sensor: 1
  technical: 1
  business: 1


4. VIEW STATISTICS
Organization Statistics:
-----------------------------------
Total Documents: 4
Organized Documents: 4
Success Rate: 100.00%

Documents by Category:
  sensor: 2
  technical: 1
  business: 1

=== Demo Complete ===
```

## Integration Tips

1. **Inject the services** into your controllers or other services
2. **Handle errors gracefully** using try-catch blocks
3. **Validate input** before passing to the organization functions
4. **Use batch processing** for multiple documents to improve performance
5. **Preview first** with `generateOrganizationPlan()` before actual organization
6. **Monitor statistics** with `getOrganizationStats()` for insights

## Next Steps

- Integrate with file upload functionality
- Add UI components for visualization
- Implement persistence layer for organized documents
- Add custom category configurations
- Create scheduled organization tasks
