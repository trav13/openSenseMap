# AI Document Organization System

## Overview

The AI Document Organization System is an intelligent, automated solution for organizing and managing documents based on content analysis. The system uses natural language processing techniques to classify documents, extract metadata, and organize them into a structured directory hierarchy.

## Features

- **Content Analysis**: Automatic classification of documents into categories (technical, scientific, business, legal, educational, sensor data, general)
- **Keyword Extraction**: Identifies the most relevant keywords from document content
- **Language Detection**: Detects the language of the document (English, German, Spanish, French)
- **Sentiment Analysis**: Analyzes the sentiment of the content (positive, negative, neutral)
- **Directory Management**: Creates and manages directory structures based on document categories
- **Path Validation**: Ensures generated paths are valid and secure
- **Batch Processing**: Organize multiple documents at once with detailed statistics
- **Organization Planning**: Preview organization plan before applying changes

## Architecture

The system consists of three main services:

### 1. contentAnalyzer

Responsible for analyzing document content and extracting metadata.

**Methods:**
- `analyzeContent(content)` - Comprehensive content analysis
- `classifyDocument(content)` - Classify document into categories
- `extractKeywords(content)` - Extract key terms from content
- `detectLanguage(content)` - Detect document language
- `analyzeSentiment(content)` - Analyze content sentiment

### 2. directoryManager

Manages directory structures and path generation.

**Methods:**
- `createDirectoryStructure(category, options)` - Create basic directory hierarchy
- `createDetailedStructure(category, subcategory, options)` - Create detailed hierarchical structure with nested subdirectories
- `validatePath(path)` - Validate file system paths
- `generatePath(documentMetadata)` - Generate path from metadata
- `normalizeDirectoryName(name)` - Sanitize directory names
- `getDirectoryTree(structure)` - Get tree representation of structure

### 3. documentOrganizer

Main orchestrator that combines content analysis and directory management.

**Methods:**
- `organizeDocument(document, options)` - Organize a single document
- `organizeMultipleDocuments(documents, options)` - Organize multiple documents
- `generateOrganizationPlan(document)` - Preview organization without applying
- `getOrganizationStats()` - Get organization statistics

## Usage Examples

### Organizing a Single Document

```javascript
angular.module('myApp').controller('MyController', function(documentOrganizer) {
  var document = {
    name: 'sensor-report',
    content: 'The senseBox sensor measured temperature and humidity data...',
    type: 'report',
    date: new Date()
  };

  var result = documentOrganizer.organizeDocument(document);
  
  if (result.success) {
    console.log('Document organized at:', result.targetPath);
    console.log('Category:', result.analysis.classification.category);
    console.log('Keywords:', result.analysis.keywords);
  }
});
```

### Organizing Multiple Documents

```javascript
angular.module('myApp').controller('BatchController', function(documentOrganizer) {
  var documents = [
    { name: 'doc1', content: 'Technical documentation...' },
    { name: 'doc2', content: 'Business report...' },
    { name: 'doc3', content: 'Sensor measurements...' }
  ];

  var results = documentOrganizer.organizeMultipleDocuments(documents);
  
  console.log('Total:', results.total);
  console.log('Successful:', results.successful);
  console.log('Failed:', results.failed);
  console.log('Summary by category:', results.summary);
  console.log('Duration:', results.duration, 'seconds');
});
```

### Previewing Organization Plan

```javascript
angular.module('myApp').controller('PreviewController', function(documentOrganizer) {
  var document = {
    name: 'research-paper',
    content: 'This research study analyzes data from experiments...'
  };

  var plan = documentOrganizer.generateOrganizationPlan(document);
  
  console.log('Target path:', plan.targetPath);
  console.log('Category:', plan.analysis.category);
  console.log('Confidence:', plan.analysis.confidence);
  console.log('Top keywords:', plan.analysis.topKeywords);
  console.log('Recommendations:', plan.recommendations);
});
```

### Getting Organization Statistics

```javascript
angular.module('myApp').controller('StatsController', function(documentOrganizer) {
  var stats = documentOrganizer.getOrganizationStats();
  
  console.log('Total documents processed:', stats.totalDocuments);
  console.log('Successfully organized:', stats.organizedDocuments);
  console.log('Success rate:', stats.successRate);
  console.log('Documents by category:', stats.categories);
});
```

## Document Classification Categories

The system classifies documents into the following categories:

1. **Technical** - Code, APIs, algorithms, debugging, development
2. **Scientific** - Research, studies, experiments, analysis, methodology
3. **Business** - Revenue, markets, customers, strategy, sales
4. **Legal** - Contracts, agreements, compliance, regulations
5. **Educational** - Courses, tutorials, guides, lessons, instructions
6. **Sensor** - Sensor data, measurements, senseBox, openSenseMap
7. **Medical** - Healthcare applications (Cerner PowerChart/MPages, Dragon Dictation, PACS/RIS, Pharmacy), medical interfaces (HL7, FHIR, Rhapsody/Cloverleaf/Mirth), clinical workflows, regulatory/clinical (Joint Commission, CMS)
8. **Infrastructure** - IT infrastructure (networking, servers, storage, virtualization), field techs, application deployment (SCCM/Intune), domain administration, service desk, security, desktop architecture with detailed project tracking
9. **General** - Uncategorized or ambiguous content

> **Note**: See [DIRECTORY_STRUCTURE_VISUALIZATION.md](DIRECTORY_STRUCTURE_VISUALIZATION.md) for complete hierarchical structures with all subdirectories.

## Directory Structure

The system generates organized directory structures based on document categories:

```
/documents/
  ├── technical/
  │   └── 2024-11-20/
  │       ├── code/
  │       ├── documentation/
  │       ├── configuration/
  │       └── scripts/
  ├── scientific/
  │   └── 2024-11-20/
  │       ├── research/
  │       ├── data/
  │       ├── analysis/
  │       └── publications/
  ├── sensor/
  │   └── 2024-11-20/
  │       ├── measurements/
  │       ├── calibration/
  │       ├── metadata/
  │       └── reports/
  ├── medical/
  │   └── 2024-11-20/
  │       ├── Medical_Applications/
  │       ├── Medical_Interfaces/
  │       ├── Clinical_Workflows/
  │       └── Regulatory_Clinical/
  ├── infrastructure/
  │   └── 2024-11-20/
  │       ├── Infrastructure/
  │       ├── Application_Deployment/
  │       ├── Domain_Administration/
  │       ├── Security/
  │       ├── Accounts_AD/
  │       ├── Networking/
  │       ├── Virtualization/
  │       ├── Service_Desk/
  │       ├── Field_Services/
  │       └── Governance_And_Architecture/
  └── ...
```

### Detailed Hierarchical Structures

For complex categories like IT infrastructure, the system supports detailed multi-level directory hierarchies:

**Infrastructure/Desktop_Architecture_And_Engineering:**
```
Infrastructure/
  Desktop_Architecture_And_Engineering/
    Standards/
      Windows_11_Build_Standards.md
      Hardware_Standards.md
      Naming_Conventions.md
      OU_And_VLAN_Standards.md
    Imaging_And_Provisioning/
      SCCM_Task_Sequences.md
      Intune_Enrollment.md
      Driver_Management.md
      Pre_And_Post_Install_Checklists.md
    Application_Stacks/
      TrackingBoard/
        Overview.md
        Pilot_PCs/
        Runbooks/
        Known_Issues/
      Dragon_Dictation/
        Overview.md
        Citrix_Config.md
        Local_Client_Config.md
        Troubleshooting_Guide.md
      Cerner_And_Clinical_Apps/
        Cerner_Client_Config.md
        Citrix_Profiles.md
    Tools_And_Scripts/
      PowerShell_Modules/
      Packaging_Scripts/
      Health_Check_Scripts/
    Project_Specific/
      MHN_Pilot_Tracking/
      Windows_11_Migration/
      Clinic_Rollouts/
```

Use `createDetailedStructure()` to generate these complex hierarchies:

```javascript
var detailedStructure = directoryManager.createDetailedStructure(
  'infrastructure',
  'Desktop_Architecture_And_Engineering',
  { basePath: '/IT_Documentation' }
);
```

## Configuration Options

### organizeDocument / organizeMultipleDocuments Options

```javascript
{
  basePath: '/documents',        // Base directory path
  includeTimestamp: true         // Include timestamp in directory structure
}
```

### createDirectoryStructure Options

```javascript
{
  basePath: '/documents',        // Base directory path
  includeTimestamp: true,        // Include date in path
  subdirectories: []             // Custom subdirectory list
}
```

## Security Features

- **Path Validation**: Prevents directory traversal attacks
- **Character Sanitization**: Removes invalid filesystem characters
- **Reserved Name Detection**: Blocks Windows reserved names (CON, PRN, etc.)
- **Length Validation**: Ensures paths don't exceed filesystem limits

## Testing

The system includes comprehensive unit tests for all services:

```bash
npm test
```

Test files:
- `test/unit/services/contentAnalyzer.spec.js`
- `test/unit/services/directoryManager.spec.js`
- `test/unit/services/documentOrganizer.spec.js`

## Error Handling

The system provides detailed error messages:

```javascript
// Invalid document
{
  success: false,
  error: 'Invalid document: must be an object',
  document: { ... }
}

// Invalid path
{
  success: false,
  error: 'Generated path is invalid: Path contains invalid characters',
  document: { ... }
}
```

## Performance Considerations

- **Batch Processing**: Use `organizeMultipleDocuments()` for better performance with multiple documents
- **Content Length**: Classification accuracy improves with longer content (>50 words recommended)
- **Language Detection**: Works best with content containing common words
- **Caching**: Statistics are cached for efficient retrieval

## Future Enhancements

Potential improvements for future versions:

1. Machine learning-based classification
2. Support for additional languages
3. Custom category definitions
4. Document deduplication
5. Metadata extraction from file properties
6. Integration with cloud storage services
7. Real-time document monitoring
8. Advanced search and filtering capabilities

## Dependencies

- AngularJS 1.x
- No external AI/NLP libraries required (uses built-in text processing)

## License

Part of the openSenseMap project - MIT License

## Support

For issues or questions, please refer to the main openSenseMap repository:
https://github.com/sensebox/openSenseMap
