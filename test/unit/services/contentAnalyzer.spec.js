(function () {
  'use strict';

  describe('Service: contentAnalyzer', function () {
    var contentAnalyzer;

    // Load the module
    beforeEach(module('openSenseMapApp'));

    // Inject the service
    beforeEach(inject(function (_contentAnalyzer_) {
      contentAnalyzer = _contentAnalyzer_;
    }));

    describe('analyzeContent', function () {
      it('should analyze content and return comprehensive analysis', function () {
        var content = 'This is a test document about sensor data and temperature measurements.';
        var result = contentAnalyzer.analyzeContent(content);

        expect(result).to.be.an('object');
        expect(result).to.have.property('classification');
        expect(result).to.have.property('keywords');
        expect(result).to.have.property('language');
        expect(result).to.have.property('sentiment');
        expect(result).to.have.property('wordCount');
        expect(result).to.have.property('characterCount');
        expect(result).to.have.property('timestamp');
      });

      it('should throw error for invalid content', function () {
        expect(function () {
          contentAnalyzer.analyzeContent();
        }).to.throw('Invalid content: content must be a non-empty string');

        expect(function () {
          contentAnalyzer.analyzeContent(null);
        }).to.throw('Invalid content: content must be a non-empty string');

        expect(function () {
          contentAnalyzer.analyzeContent(123);
        }).to.throw('Invalid content: content must be a non-empty string');
      });

      it('should correctly count words and characters', function () {
        var content = 'Hello world test';
        var result = contentAnalyzer.analyzeContent(content);

        expect(result.wordCount).to.equal(3);
        expect(result.characterCount).to.equal(16);
      });
    });

    describe('classifyDocument', function () {
      it('should classify technical documents', function () {
        var content = 'This code function uses an algorithm to debug the API error.';
        var result = contentAnalyzer.classifyDocument(content);

        expect(result).to.be.an('object');
        expect(result).to.have.property('category');
        expect(result).to.have.property('confidence');
        expect(result).to.have.property('scores');
        expect(result.category).to.equal('technical');
      });

      it('should classify sensor documents', function () {
        var content = 'The senseBox sensor measures temperature and humidity data from openSenseMap.';
        var result = contentAnalyzer.classifyDocument(content);

        expect(result.category).to.equal('sensor');
        expect(result.scores.sensor).to.be.above(0);
      });

      it('should classify business documents', function () {
        var content = 'Our revenue and profit increased due to successful market strategy and customer sales.';
        var result = contentAnalyzer.classifyDocument(content);

        expect(result.category).to.equal('business');
      });

      it('should classify medical documents', function () {
        var content = 'Patient clinical records and medical healthcare diagnosis treatment for pharmacy imaging HL7 FHIR interfaces.';
        var result = contentAnalyzer.classifyDocument(content);

        expect(result.category).to.equal('medical');
        expect(result.scores.medical).to.be.above(0);
      });

      it('should classify infrastructure documents', function () {
        var content = 'Deployment infrastructure server network virtualization VMware cloud Docker container architecture desktop endpoint.';
        var result = contentAnalyzer.classifyDocument(content);

        expect(result.category).to.equal('infrastructure');
        expect(result.scores.infrastructure).to.be.above(0);
      });

      it('should return general for ambiguous content', function () {
        var content = 'The quick brown fox jumps over the lazy dog.';
        var result = contentAnalyzer.classifyDocument(content);

        expect(result.category).to.equal('general');
        expect(result.confidence).to.equal(0);
      });

      it('should throw error for invalid content', function () {
        expect(function () {
          contentAnalyzer.classifyDocument();
        }).to.throw('Invalid content for classification');
      });
    });

    describe('extractKeywords', function () {
      it('should extract keywords from content', function () {
        var content = 'sensor temperature sensor humidity measurement measurement data';
        var result = contentAnalyzer.extractKeywords(content);

        expect(result).to.be.an('array');
        expect(result.length).to.be.above(0);
        expect(result[0]).to.have.property('word');
        expect(result[0]).to.have.property('frequency');
      });

      it('should filter out stop words', function () {
        var content = 'the and is in to of that for sensor temperature';
        var result = contentAnalyzer.extractKeywords(content);

        var words = result.map(function (item) { return item.word; });
        expect(words).to.not.include('the');
        expect(words).to.not.include('and');
      });

      it('should sort keywords by frequency', function () {
        var content = 'test test test sensor sensor data';
        var result = contentAnalyzer.extractKeywords(content);

        expect(result[0].word).to.equal('test');
        expect(result[0].frequency).to.equal(3);
        expect(result[1].word).to.equal('sensor');
        expect(result[1].frequency).to.equal(2);
      });

      it('should return empty array for invalid content', function () {
        var result = contentAnalyzer.extractKeywords();
        expect(result).to.be.an('array');
        expect(result).to.have.length(0);
      });
    });

    describe('detectLanguage', function () {
      it('should detect English content', function () {
        var content = 'The sensor is measuring temperature and humidity data in the field.';
        var result = contentAnalyzer.detectLanguage(content);

        expect(result).to.be.an('object');
        expect(result).to.have.property('language');
        expect(result).to.have.property('confidence');
        expect(result.language).to.equal('english');
      });

      it('should detect German content', function () {
        var content = 'Der Sensor ist in den Messungen von der Temperatur und das Wetter.';
        var result = contentAnalyzer.detectLanguage(content);

        expect(result.language).to.equal('german');
      });

      it('should return unknown for ambiguous content', function () {
        var content = '12345 67890 !@#$%';
        var result = contentAnalyzer.detectLanguage(content);

        expect(result.language).to.equal('unknown');
      });

      it('should handle invalid input', function () {
        var result = contentAnalyzer.detectLanguage();

        expect(result.language).to.equal('unknown');
        expect(result.confidence).to.equal(0);
      });
    });

    describe('analyzeSentiment', function () {
      it('should detect positive sentiment', function () {
        var content = 'This is great and wonderful! Excellent work, amazing success!';
        var result = contentAnalyzer.analyzeSentiment(content);

        expect(result).to.be.an('object');
        expect(result).to.have.property('sentiment');
        expect(result).to.have.property('score');
        expect(result.sentiment).to.equal('positive');
        expect(result.score).to.be.above(0);
      });

      it('should detect negative sentiment', function () {
        var content = 'This is terrible and awful! Bad error, horrible problem failed!';
        var result = contentAnalyzer.analyzeSentiment(content);

        expect(result.sentiment).to.equal('negative');
        expect(result.score).to.be.below(0);
      });

      it('should detect neutral sentiment', function () {
        var content = 'The sensor measures temperature. Data is collected daily.';
        var result = contentAnalyzer.analyzeSentiment(content);

        expect(result.sentiment).to.equal('neutral');
      });

      it('should handle invalid input', function () {
        var result = contentAnalyzer.analyzeSentiment();

        expect(result.sentiment).to.equal('neutral');
        expect(result.score).to.equal(0);
      });
    });
  });
})();
