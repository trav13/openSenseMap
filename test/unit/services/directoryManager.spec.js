(function () {
  'use strict';

  describe('Service: directoryManager', function () {
    var directoryManager;

    // Load the module
    beforeEach(module('openSenseMapApp'));

    // Inject the service
    beforeEach(inject(function (_directoryManager_) {
      directoryManager = _directoryManager_;
    }));

    describe('createDirectoryStructure', function () {
      it('should create directory structure for valid category', function () {
        var result = directoryManager.createDirectoryStructure('technical');

        expect(result).to.be.an('object');
        expect(result).to.have.property('basePath');
        expect(result).to.have.property('categoryPath');
        expect(result).to.have.property('subdirectories');
        expect(result).to.have.property('created');
        expect(result.basePath).to.equal('/documents');
      });

      it('should normalize category name in path', function () {
        var result = directoryManager.createDirectoryStructure('Technical Documents');

        expect(result.categoryPath).to.include('technical-documents');
      });

      it('should include timestamp by default', function () {
        var result = directoryManager.createDirectoryStructure('sensor');

        expect(result.categoryPath).to.match(/\/\d{4}-\d{2}-\d{2}$/);
      });

      it('should exclude timestamp when specified', function () {
        var result = directoryManager.createDirectoryStructure('sensor', {
          includeTimestamp: false
        });

        expect(result.categoryPath).to.not.match(/\/\d{4}-\d{2}-\d{2}$/);
      });

      it('should use custom base path', function () {
        var result = directoryManager.createDirectoryStructure('technical', {
          basePath: '/custom/path'
        });

        expect(result.basePath).to.equal('/custom/path');
        expect(result.categoryPath).to.include('/custom/path');
      });

      it('should use custom subdirectories', function () {
        var customSubdirs = ['folder1', 'folder2', 'folder3'];
        var result = directoryManager.createDirectoryStructure('technical', {
          subdirectories: customSubdirs
        });

        expect(result.subdirectories).to.have.length(3);
        expect(result.subdirectories[0]).to.include('folder1');
      });

      it('should throw error for invalid category', function () {
        expect(function () {
          directoryManager.createDirectoryStructure();
        }).to.throw('Invalid category: category must be a non-empty string');

        expect(function () {
          directoryManager.createDirectoryStructure(null);
        }).to.throw('Invalid category: category must be a non-empty string');
      });
    });

    describe('createDetailedStructure', function () {
      it('should create detailed hierarchical structure for infrastructure', function () {
        var result = directoryManager.createDetailedStructure('infrastructure', 'Desktop_Architecture_And_Engineering');

        expect(result).to.be.an('object');
        expect(result).to.have.property('basePath');
        expect(result).to.have.property('categoryPath');
        expect(result).to.have.property('hierarchy');
        expect(result).to.have.property('created');
      });

      it('should create hierarchy for all subcategories when no subcategory specified', function () {
        var result = directoryManager.createDetailedStructure('infrastructure');

        expect(result.hierarchy).to.be.an('object');
        expect(result.hierarchy).to.have.property('Desktop_Architecture_And_Engineering');
      });

      it('should fall back to basic structure for categories without detailed templates', function () {
        var result = directoryManager.createDetailedStructure('technical');

        expect(result).to.have.property('subdirectories');
        expect(result.subdirectories).to.be.an('array');
      });

      it('should throw error for invalid category', function () {
        expect(function () {
          directoryManager.createDetailedStructure();
        }).to.throw('Invalid category: category must be a non-empty string');
      });
    });

    describe('validatePath', function () {
      it('should validate correct paths', function () {
        var result = directoryManager.validatePath('/documents/technical/2024/file.txt');

        expect(result).to.be.an('object');
        expect(result).to.have.property('valid');
        expect(result).to.have.property('errors');
        expect(result.valid).to.be.true;
        expect(result.errors).to.have.length(0);
      });

      it('should reject paths with invalid characters', function () {
        var result = directoryManager.validatePath('/documents/test<>file.txt');

        expect(result.valid).to.be.false;
        expect(result.errors).to.include('Path contains invalid characters');
      });

      it('should reject paths with directory traversal', function () {
        var result = directoryManager.validatePath('/documents/../etc/passwd');

        expect(result.valid).to.be.false;
        expect(result.errors).to.include('Path contains directory traversal sequences');
      });

      it('should reject paths that are too long', function () {
        var longPath = '/documents/' + 'a'.repeat(300);
        var result = directoryManager.validatePath(longPath);

        expect(result.valid).to.be.false;
        expect(result.errors).to.include('Path exceeds maximum length');
      });

      it('should reject reserved names', function () {
        var result = directoryManager.validatePath('/documents/CON/file.txt');

        expect(result.valid).to.be.false;
        expect(result.errors).to.include('Path contains reserved system names');
      });

      it('should reject invalid input', function () {
        var result = directoryManager.validatePath();

        expect(result.valid).to.be.false;
        expect(result.errors.length).to.be.above(0);
      });
    });

    describe('generatePath', function () {
      it('should generate path from document metadata', function () {
        var metadata = {
          category: 'technical',
          type: 'documentation',
          name: 'API Guide',
          date: new Date('2024-01-15')
        };

        var path = directoryManager.generatePath(metadata);

        expect(path).to.be.a('string');
        expect(path).to.include('/documents/technical');
        expect(path).to.include('/2024/01');
        expect(path).to.include('documentation');
        expect(path).to.include('api-guide');
      });

      it('should use defaults for missing metadata', function () {
        var metadata = {};
        var path = directoryManager.generatePath(metadata);

        expect(path).to.include('/documents/general');
        expect(path).to.include('/document/');
        expect(path).to.include('untitled');
      });

      it('should normalize document name', function () {
        var metadata = {
          name: 'My Test Document!!!'
        };

        var path = directoryManager.generatePath(metadata);

        expect(path).to.include('my-test-document');
      });

      it('should throw error for invalid metadata', function () {
        expect(function () {
          directoryManager.generatePath();
        }).to.throw('Invalid documentMetadata: must be an object');

        expect(function () {
          directoryManager.generatePath(null);
        }).to.throw('Invalid documentMetadata: must be an object');
      });
    });

    describe('normalizeDirectoryName', function () {
      it('should normalize directory names', function () {
        var result = directoryManager.normalizeDirectoryName('Test Directory');

        expect(result).to.equal('test-directory');
      });

      it('should remove invalid characters', function () {
        var result = directoryManager.normalizeDirectoryName('Test@#$%Directory!!!');

        expect(result).to.equal('testdirectory');
      });

      it('should replace spaces with hyphens', function () {
        var result = directoryManager.normalizeDirectoryName('one two three');

        expect(result).to.equal('one-two-three');
      });

      it('should handle multiple hyphens', function () {
        var result = directoryManager.normalizeDirectoryName('test---directory');

        expect(result).to.equal('test-directory');
      });

      it('should remove leading and trailing hyphens', function () {
        var result = directoryManager.normalizeDirectoryName('-test-directory-');

        expect(result).to.equal('test-directory');
      });

      it('should return untitled for invalid input', function () {
        expect(directoryManager.normalizeDirectoryName()).to.equal('untitled');
        expect(directoryManager.normalizeDirectoryName('')).to.equal('untitled');
        expect(directoryManager.normalizeDirectoryName(null)).to.equal('untitled');
      });
    });

    describe('getDirectoryTree', function () {
      it('should generate directory tree from structure', function () {
        var structure = {
          basePath: '/documents',
          categoryPath: '/documents/technical',
          subdirectories: [
            '/documents/technical/code',
            '/documents/technical/docs'
          ]
        };

        var tree = directoryManager.getDirectoryTree(structure);

        expect(tree).to.be.an('object');
        expect(tree).to.have.property('name');
        expect(tree).to.have.property('type');
        expect(tree).to.have.property('children');
        expect(tree.type).to.equal('directory');
        expect(tree.children).to.be.an('array');
      });

      it('should include subdirectories in tree', function () {
        var structure = {
          basePath: '/documents',
          categoryPath: '/documents/technical',
          subdirectories: [
            '/documents/technical/code',
            '/documents/technical/docs'
          ]
        };

        var tree = directoryManager.getDirectoryTree(structure);

        expect(tree.children).to.have.length(1);
        expect(tree.children[0].children).to.have.length(2);
      });

      it('should throw error for invalid structure', function () {
        expect(function () {
          directoryManager.getDirectoryTree();
        }).to.throw('Invalid structure: must be an object');

        expect(function () {
          directoryManager.getDirectoryTree(null);
        }).to.throw('Invalid structure: must be an object');
      });
    });
  });
})();
