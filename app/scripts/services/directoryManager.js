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
      createDetailedStructure: createDetailedStructure,
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
      medical: ['Medical_Applications', 'Medical_Interfaces', 'Clinical_Workflows', 'Regulatory_Clinical'],
      infrastructure: ['Infrastructure', 'Application_Deployment', 'Domain_Administration', 'Security', 'Accounts_AD', 'Networking', 'Virtualization', 'Service_Desk', 'Field_Services', 'Governance_And_Architecture'],
      general: ['documents', 'misc']
    };

    // Detailed hierarchical structure templates for complex categories
    var detailedStructures = {
      infrastructure: {
        'Desktop_Architecture_And_Engineering': {
          'Standards': ['Windows_11_Build_Standards.md', 'Hardware_Standards.md', 'Naming_Conventions.md', 'OU_And_VLAN_Standards.md'],
          'Imaging_And_Provisioning': ['SCCM_Task_Sequences.md', 'Intune_Enrollment.md', 'Driver_Management.md', 'Pre_And_Post_Install_Checklists.md'],
          'Application_Stacks': {
            'TrackingBoard': ['Overview.md', 'Pilot_PCs', 'Runbooks', 'Known_Issues'],
            'Dragon_Dictation': ['Overview.md', 'Citrix_Config.md', 'Local_Client_Config.md', 'Troubleshooting_Guide.md'],
            'Cerner_And_Clinical_Apps': ['Cerner_Client_Config.md', 'Citrix_Profiles.md']
          },
          'Tools_And_Scripts': ['PowerShell_Modules', 'Packaging_Scripts', 'Health_Check_Scripts'],
          'Project_Specific': ['MHN_Pilot_Tracking', 'Windows_11_Migration', 'Clinic_Rollouts']
        },
        'Application_Deployment': {
          'SCCM': ['Collections_And_Boundaries.md', 'Application_Packaging_Guide.md', 'Deployment_Types.md', 'Maintenance_Windows.md', 'Reporting.md'],
          'Intune': ['Enrollment_Profiles.md', 'Configuration_Profiles.md', 'Compliance_Policies.md', 'App_Assignments.md'],
          'Shared_Deployment_Standards': ['Packaging_Standards.md', 'Change_Control_Process.md', 'Rollback_Procedures.md'],
          'ServiceNow_Integration': ['SN_Change_Automation.md', 'SN_Incident_Auto_Creation_For_Deployments.md', 'SN_Catalog_Items_For_Software_Requests.md']
        },
        'Domain_Administration': {
          'AD_Structure': ['Forest_And_Domains.md', 'OU_Design.md', 'Group_Policy_Model.md'],
          'Group_Policy': ['Baseline_GPOs.md', 'Security_GPOs.md', 'Desktop_GPOs.md'],
          'Access_Control': ['Admin_Groups.md', 'Service_Accounts.md', 'Tiering_Model.md']
        },
        'Security': {
          'Security_Standards': [],
          'Endpoint_Security': [],
          'Incident_Response': [],
          'Vulnerability_Management': []
        },
        'Accounts_AD': {
          'User_Provisioning': [],
          'Role_Definitions': [],
          'Naming_Conventions': [],
          'Termination_Procedures': []
        },
        'Networking': {
          'WAN_LAN_WiFi': [],
          'VLAN_Design': [],
          'IP_Addressing': [],
          'Firewall_Rulesets': [],
          'VPN_Remote_Access': []
        },
        'Virtualization': {
          'Hypervisor_Standards': [],
          'Cluster_Layouts': [],
          'VM_Provisioning': [],
          'Templates_And_Golden_Images': [],
          'Monitoring_And_Capacity': []
        },
        'Service_Desk': {
          'Tier1_Procedures': [],
          'Triage_Checklists': [],
          'Escalation_Paths': [],
          'Knowledge_Base_Entry_Guidelines': []
        },
        'Field_Services': {
          'CHH_Field_Techs': ['Site_Maps_And_Locations.md', 'Device_Standards', 'Quick_Runbooks'],
          'SMC_Field_Techs': ['Site_Maps_And_Locations.md', 'Device_Standards', 'Quick_Runbooks'],
          'Rivers_Field_Techs': ['Site_Maps_And_Locations.md', 'Device_Standards', 'Quick_Runbooks'],
          'MarshallHealth_Clinics_Field_Techs': ['Site_Maps_And_Locations.md', 'Device_Standards', 'Quick_Runbooks']
        },
        'Governance_And_Architecture': {
          'Cross_Team_Diagrams': [],
          'End_To_End_Flows': ['TrackingBoard_End_To_End.md', 'Dragon_Dictation_End_To_End.md'],
          'RACI_Charts': ['TrackingBoard_Telemetry_RACI.md', 'Dragon_Dictation_RACI.md']
        }
      },
      medical: {
        'Medical_Applications': {
          'Cerner_Applications': [],
          'Dragon_Dictation': [],
          'Imaging_RIS_PACS': [],
          'Pharmacy_Systems': [],
          'Ancillary_Systems': []
        },
        'Medical_Interfaces': {
          'HL7_Interfaces': [],
          'FHIR_APIs': [],
          'Integration_Engine': [],
          'Interface_Runbooks': []
        },
        'Clinical_Workflows': {
          'Order_Sets': [],
          'Documentation_Flows': [],
          'Clinical_Decision_Support': []
        },
        'Regulatory_Clinical': {
          'Quality_Reporting': [],
          'Clinical_Audits': []
        }
      }
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
     * Creates a detailed hierarchical directory structure
     * @param {string} category - The category for which to create structure
     * @param {string} subcategory - Optional subcategory for detailed structure
     * @param {Object} options - Optional configuration
     * @returns {Object} Detailed directory structure information
     */
    function createDetailedStructure (category, subcategory, options) {
      if (!category || typeof category !== 'string') {
        throw new Error('Invalid category: category must be a non-empty string');
      }

      options = options || {};
      var basePath = options.basePath || '/documents';

      // Check if detailed structure exists for this category
      if (!detailedStructures[category]) {
        // Fall back to basic structure
        return createDirectoryStructure(category, options);
      }

      var categoryPath = basePath + '/' + normalizeDirectoryName(category);
      var structure = {
        basePath: basePath,
        categoryPath: categoryPath,
        subdirectories: [],
        hierarchy: {},
        created: new Date().toISOString()
      };

      // Build hierarchical structure
      if (subcategory && detailedStructures[category][subcategory]) {
        var subcategoryPath = categoryPath + '/' + normalizeDirectoryName(subcategory);
        structure.hierarchy = buildHierarchy(subcategoryPath, detailedStructures[category][subcategory]);
      } else {
        // Build all subcategories
        var categoryStructure = detailedStructures[category];
        for (var key in categoryStructure) {
          if (categoryStructure.hasOwnProperty(key)) {
            var subPath = categoryPath + '/' + normalizeDirectoryName(key);
            structure.hierarchy[key] = buildHierarchy(subPath, categoryStructure[key]);
          }
        }
      }

      return structure;
    }

    /**
     * Recursively builds directory hierarchy
     * @private
     */
    function buildHierarchy (basePath, structure) {
      var result = {
        path: basePath,
        children: []
      };

      if (Array.isArray(structure)) {
        // Simple array of subdirectories/files
        structure.forEach(function (item) {
          result.children.push({
            path: basePath + '/' + item,
            name: item
          });
        });
      } else if (typeof structure === 'object') {
        // Nested structure
        for (var key in structure) {
          if (structure.hasOwnProperty(key)) {
            var childPath = basePath + '/' + normalizeDirectoryName(key);
            result.children.push(buildHierarchy(childPath, structure[key]));
          }
        }
      }

      return result;
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
