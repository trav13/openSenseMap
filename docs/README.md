# AI Document Organization System - Quick Start

## What is this?

The AI Document Organization System automatically organizes documents by analyzing their content and placing them into appropriate categories and directory structures. It uses natural language processing techniques to understand document content and make intelligent organization decisions.

## Quick Example

```javascript
// Inject the service
angular.module('myApp').controller('MyCtrl', function(documentOrganizer) {
  
  // Organize a document
  var result = documentOrganizer.organizeDocument({
    name: 'sensor-report',
    content: 'The senseBox sensor measured temperature and humidity...',
    type: 'report'
  });
  
  console.log('Category:', result.analysis.classification.category); // 'sensor'
  console.log('Path:', result.targetPath); // '/documents/sensor/2024/11/report/sensor-report'
});
```

## Key Features

✓ **Automatic Classification** - 7 categories (technical, scientific, business, legal, educational, sensor, general)  
✓ **Keyword Extraction** - Find the most relevant terms in documents  
✓ **Language Detection** - English, German, Spanish, French  
✓ **Sentiment Analysis** - Positive, negative, or neutral  
✓ **Batch Processing** - Organize multiple documents at once  
✓ **Security Built-in** - Path validation and sanitization  
✓ **No Dependencies** - Works with just AngularJS  

## Services

### 1. contentAnalyzer
Analyzes document content for classification and metadata extraction.

```javascript
contentAnalyzer.analyzeContent(text)
contentAnalyzer.classifyDocument(text)
contentAnalyzer.extractKeywords(text)
contentAnalyzer.detectLanguage(text)
contentAnalyzer.analyzeSentiment(text)
```

### 2. directoryManager
Manages directory structures and path generation.

```javascript
directoryManager.createDirectoryStructure(category, options)
directoryManager.validatePath(path)
directoryManager.generatePath(metadata)
directoryManager.normalizeDirectoryName(name)
```

### 3. documentOrganizer
Main orchestrator for document organization.

```javascript
documentOrganizer.organizeDocument(doc, options)
documentOrganizer.organizeMultipleDocuments(docs, options)
documentOrganizer.generateOrganizationPlan(doc)
documentOrganizer.getOrganizationStats()
```

## Files

### Services
- `app/scripts/services/contentAnalyzer.js`
- `app/scripts/services/directoryManager.js`
- `app/scripts/services/documentOrganizer.js`

### Tests
- `test/unit/services/contentAnalyzer.spec.js`
- `test/unit/services/directoryManager.spec.js`
- `test/unit/services/documentOrganizer.spec.js`

### Documentation
- `docs/AI_DOCUMENT_ORGANIZATION.md` - Complete documentation
- `docs/AI_DOCUMENT_ORGANIZATION_EXAMPLES.md` - Usage examples
- `docs/DIRECTORY_STRUCTURE_VISUALIZATION.md` - **Visual directory structure diagrams** (PDF-ready, OneNote/SharePoint compatible)
- `docs/README.md` - This file

## Testing

Run all tests:
```bash
npm test
```

Run linter:
```bash
npm run lint
```

## Next Steps

1. **Read the full documentation**: `docs/AI_DOCUMENT_ORGANIZATION.md`
2. **Try the examples**: `docs/AI_DOCUMENT_ORGANIZATION_EXAMPLES.md`
3. **Integrate into your app**: Inject the services and start organizing!

## Support

For questions or issues, see the main openSenseMap repository.

## License

MIT - Part of the openSenseMap project
