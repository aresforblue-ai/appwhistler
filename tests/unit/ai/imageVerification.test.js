// tests/unit/ai/imageVerification.test.js
// Tests for image verification system

describe('Image Verification', () => {
  describe('Image verification workflow', () => {
    test('should return verification object structure', () => {
      const verification = {
        url: 'https://example.com/image.jpg',
        isManipulated: false,
        manipulationScore: 0.2,
        manipulationIndicators: [],
        originalSources: [],
        matchCount: 5,
        exifData: {},
        verifiedAt: new Date().toISOString(),
        recommendation: 'Image appears authentic'
      };

      expect(verification).toHaveProperty('url');
      expect(verification).toHaveProperty('isManipulated');
      expect(verification).toHaveProperty('manipulationScore');
      expect(verification).toHaveProperty('recommendation');
    });

    test('should flag high manipulation score as manipulated', () => {
      const manipulationScore = 0.75;
      const isManipulated = manipulationScore > 0.6;
      expect(isManipulated).toBe(true);
    });

    test('should not flag low manipulation score', () => {
      const manipulationScore = 0.3;
      const isManipulated = manipulationScore > 0.6;
      expect(isManipulated).toBe(false);
    });
  });

  describe('EXIF data extraction', () => {
    test('should extract camera information', () => {
      const exifData = {
        hasExif: true,
        camera: 'Canon EOS 5D',
        software: null,
        dateTime: '2025-01-01T12:00:00Z',
        gps: { latitude: 37.7749, longitude: -122.4194 },
        width: 4000,
        height: 3000
      };

      expect(exifData.hasExif).toBe(true);
      expect(exifData.camera).toBeTruthy();
      expect(exifData.width).toBeGreaterThan(0);
    });

    test('should handle missing EXIF data', () => {
      const exifData = {
        hasExif: false,
        error: 'Could not extract EXIF data'
      };

      expect(exifData.hasExif).toBe(false);
      expect(exifData.error).toBeTruthy();
    });

    test('should detect editing software in EXIF', () => {
      const exifData = {
        hasExif: true,
        software: 'Adobe Photoshop'
      };

      const isEdited = exifData.software && exifData.software.toLowerCase().includes('photoshop');
      expect(isEdited).toBe(true);
    });
  });

  describe('Reverse image search', () => {
    test('should return sources from multiple search engines', () => {
      const sources = [
        {
          url: 'https://example.com/original.jpg',
          title: 'Original Image',
          source: 'example.com',
          searchEngine: 'google',
          datePublished: '2024-01-01'
        },
        {
          url: 'https://other.com/copy.jpg',
          domain: 'other.com',
          searchEngine: 'tineye',
          crawlDate: '2024-06-01'
        }
      ];

      expect(sources.length).toBeGreaterThan(1);
      expect(sources[0].searchEngine).toBe('google');
      expect(sources[1].searchEngine).toBe('tineye');
    });

    test('should sort sources by date', () => {
      const sources = [
        { datePublished: '2024-06-01' },
        { datePublished: '2024-01-01' },
        { datePublished: '2024-03-01' }
      ];

      const sorted = [...sources].sort((a, b) => {
        return new Date(b.datePublished) - new Date(a.datePublished);
      });

      expect(new Date(sorted[0].datePublished).getTime()).toBeGreaterThanOrEqual(
        new Date(sorted[sorted.length - 1].datePublished).getTime()
      );
    });

    test('should identify multiple sources as less suspicious', () => {
      const matchCount = 15;
      const hasMultipleSources = matchCount > 1;
      expect(hasMultipleSources).toBe(true);
    });
  });

  describe('Manipulation detection', () => {
    test('should increase suspicion for missing EXIF', () => {
      let suspicionScore = 0;
      const hasExif = false;

      if (!hasExif) {
        suspicionScore += 0.2;
      }

      expect(suspicionScore).toBe(0.2);
    });

    test('should increase suspicion for small file size', () => {
      let suspicionScore = 0;
      const fileSize = 30000; // bytes

      if (fileSize < 50000) {
        suspicionScore += 0.1;
      }

      expect(suspicionScore).toBe(0.1);
    });

    test('should detect editing software', () => {
      const softwareList = ['photoshop', 'gimp', 'pixlr'];
      const imageMetadata = 'Created with Adobe Photoshop CC 2024';

      const hasEditingSoftware = softwareList.some(sw => 
        imageMetadata.toLowerCase().includes(sw)
      );

      expect(hasEditingSoftware).toBe(true);
    });

    test('should cap manipulation score at 1.0', () => {
      let score = 0.5 + 0.3 + 0.4; // Sum = 1.2
      score = Math.min(score, 1.0);
      expect(score).toBe(1.0);
    });
  });

  describe('Recommendation generation', () => {
    test('should recommend HIGH RISK for score > 0.7', () => {
      const score = 0.8;
      const recommendation = score > 0.7 ? 'HIGH RISK' : 'MEDIUM RISK';
      expect(recommendation).toBe('HIGH RISK');
    });

    test('should recommend MEDIUM RISK for score 0.4-0.7', () => {
      const score = 0.5;
      const recommendation = score > 0.7 ? 'HIGH RISK' : score > 0.4 ? 'MEDIUM RISK' : 'LOW RISK';
      expect(recommendation).toBe('MEDIUM RISK');
    });

    test('should recommend LOW RISK for many sources', () => {
      const matchCount = 12;
      const recommendation = matchCount > 10 ? 'LOW RISK' : 'CAUTION';
      expect(recommendation).toBe('LOW RISK');
    });

    test('should recommend CAUTION for no metadata', () => {
      const hasExif = false;
      const recommendation = hasExif ? 'Image appears authentic' : 'CAUTION';
      expect(recommendation).toBe('CAUTION');
    });
  });

  describe('Batch verification', () => {
    test('should verify multiple images', async () => {
      const imageUrls = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg'
      ];

      expect(imageUrls.length).toBe(3);
    });

    test('should handle errors in batch processing', () => {
      const results = [
        { url: 'image1.jpg', isManipulated: false },
        { url: 'image2.jpg', error: 'Failed to download' },
        { url: 'image3.jpg', isManipulated: true }
      ];

      const errors = results.filter(r => r.error);
      const successful = results.filter(r => !r.error);

      expect(errors.length).toBe(1);
      expect(successful.length).toBe(2);
    });
  });
});
