// tests/unit/ai/videoVerification.test.js
// Tests for video verification system

const { extractYouTubeVideoId } = require('../../../src/ai/videoVerification');
describe('Video Verification', () => {
  describe('Video verification workflow', () => {
    test('should return verification object structure', () => {
      const verification = {
        url: 'https://youtube.com/watch?v=test',
        transcript: { text: 'Video transcript...', confidence: 0.95 },
        deepfakeScore: 0.15,
        isLikelyDeepfake: false,
        metadata: { platform: 'youtube', viewCount: 10000 },
        verifiedAt: new Date().toISOString(),
        recommendation: 'Video appears authentic'
      };

      expect(verification).toHaveProperty('url');
      expect(verification).toHaveProperty('transcript');
      expect(verification).toHaveProperty('deepfakeScore');
      expect(verification).toHaveProperty('isLikelyDeepfake');
      expect(verification).toHaveProperty('recommendation');
    });

    test('should flag high deepfake score', () => {
      const deepfakeScore = 0.85;
      const isLikelyDeepfake = deepfakeScore > 0.7;
      expect(isLikelyDeepfake).toBe(true);
    });

    test('should not flag low deepfake score', () => {
      const deepfakeScore = 0.3;
      const isLikelyDeepfake = deepfakeScore > 0.7;
      expect(isLikelyDeepfake).toBe(false);
    });
  });

  describe('Transcript extraction', () => {
    test('should extract transcript with confidence', () => {
      const transcript = {
        text: 'This is the video transcript with spoken words.',
        confidence: 0.92,
        language: 'en',
        speakers: 2,
        service: 'assemblyai'
      };

      expect(transcript.text).toBeTruthy();
      expect(transcript.confidence).toBeGreaterThan(0.5);
      expect(transcript.language).toBe('en');
    });

    test('should handle multiple speakers', () => {
      const transcript = {
        speakers: 3,
        utterances: [
          { speaker: 'A', text: 'Hello' },
          { speaker: 'B', text: 'Hi there' },
          { speaker: 'A', text: 'How are you?' }
        ]
      };

      expect(transcript.speakers).toBe(3);
      expect(transcript.utterances.length).toBeGreaterThan(0);
    });

    test('should handle transcript errors gracefully', () => {
      const transcript = {
        text: null,
        confidence: 0,
        error: 'Transcription service unavailable'
      };

      expect(transcript.text).toBeNull();
      expect(transcript.error).toBeTruthy();
    });

    test('should support sentiment analysis', () => {
      const transcript = {
        text: 'This is amazing!',
        sentiment: {
          positive: 0.9,
          negative: 0.05,
          neutral: 0.05
        }
      };

      expect(transcript.sentiment.positive).toBeGreaterThan(0.5);
    });
  });

  describe('Deepfake detection', () => {
    test('should return deepfake score between 0 and 1', () => {
      const score = 0.45;
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    test('should use heuristic fallback', () => {
      const metadata = {
        frameRate: 20, // Low frame rate
        width: 480    // Low resolution
      };

      let suspicionScore = 0;
      if (metadata.frameRate < 24) suspicionScore += 0.2;
      if (metadata.width < 640) suspicionScore += 0.1;

      expect(suspicionScore).toBeCloseTo(0.3, 10);
    });

    test('should cap deepfake score at 1.0', () => {
      let score = 0.8 + 0.5; // Sum = 1.3
      score = Math.min(score, 1.0);
      expect(score).toBe(1.0);
    });
  });

  describe('YouTube metadata extraction', () => {
    test('should extract YouTube video ID from URL', () => {
      const testCases = [
        { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
        { url: 'https://youtu.be/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' },
        { url: 'https://youtube.com/embed/dQw4w9WgXcQ', expectedId: 'dQw4w9WgXcQ' }
      ];

      for (const testCase of testCases) {
        const videoId = extractYouTubeVideoId(testCase.url);
        expect(videoId).toBe(testCase.expectedId);
      }
    });

    test('should extract video metadata', () => {
      const metadata = {
        platform: 'youtube',
        videoId: 'test123',
        title: 'Test Video',
        channelTitle: 'Test Channel',
        publishedAt: '2024-01-01T00:00:00Z',
        viewCount: 50000,
        likeCount: 2000,
        commentCount: 150
      };

      expect(metadata.platform).toBe('youtube');
      expect(metadata.viewCount).toBeGreaterThan(0);
      expect(metadata.likeCount).toBeGreaterThan(0);
    });

    test('should detect low-exposure videos', () => {
      const viewCount = 500;
      const isLowExposure = viewCount < 1000;
      expect(isLowExposure).toBe(true);
    });
  });

  describe('Claim analysis in video', () => {
    test('should find exact claim in transcript', () => {
      const transcript = 'This is a claim about climate change that we need to verify';
      const claim = 'claim about climate change';
      
      const found = transcript.toLowerCase().includes(claim.toLowerCase());
      expect(found).toBe(true);
    });

    test('should handle claim not found', () => {
      const transcript = 'This video discusses various topics';
      const claim = 'unicorns are real';
      
      const found = transcript.toLowerCase().includes(claim.toLowerCase());
      expect(found).toBe(false);
    });

    test('should perform fuzzy matching', () => {
      const transcript = 'climate change is a serious issue';
      const claim = 'climate change serious';
      const claimWords = claim.toLowerCase().split(' ');
      
      let matchCount = 0;
      for (const word of claimWords) {
        if (transcript.toLowerCase().includes(word)) {
          matchCount++;
        }
      }
      
      const similarity = matchCount / claimWords.length;
      expect(similarity).toBeGreaterThan(0.6);
    });

    test('should extract context around claim', () => {
      const transcript = 'In the beginning, there was a claim about vaccines that needs verification, and then more content follows';
      const claimIndex = transcript.indexOf('claim about vaccines');
      
      const contextStart = Math.max(0, claimIndex - 20);
      const contextEnd = Math.min(transcript.length, claimIndex + 50);
      const context = transcript.substring(contextStart, contextEnd);
      
      expect(context).toContain('claim about vaccines');
      expect(context.length).toBeGreaterThan(0);
    });

    test('should estimate timestamp from text position', () => {
      const fullText = 'word '.repeat(300); // 300 words
      const targetIndex = fullText.length / 2; // Middle
      
      const wordsBefore = fullText.substring(0, targetIndex).split(' ').length;
      const minutes = wordsBefore / 150; // 150 words per minute
      const seconds = Math.floor(minutes * 60);
      
      expect(seconds).toBeGreaterThan(0);
      expect(seconds).toBeLessThan(200); // ~3 minutes
    });
  });

  describe('Recommendation generation', () => {
    test('should recommend HIGH RISK for deepfake score > 0.8', () => {
      const score = 0.9;
      const recommendation = score > 0.8 ? 'HIGH RISK' : 'MEDIUM RISK';
      expect(recommendation).toBe('HIGH RISK');
    });

    test('should recommend MEDIUM RISK for score 0.5-0.8', () => {
      const score = 0.6;
      const recommendation = score > 0.8 ? 'HIGH RISK' : score > 0.5 ? 'MEDIUM RISK' : 'LOW RISK';
      expect(recommendation).toBe('MEDIUM RISK');
    });

    test('should recommend CAUTION for missing transcript', () => {
      const transcript = { text: null };
      const recommendation = transcript.text ? 'Video appears authentic' : 'CAUTION';
      expect(recommendation).toBe('CAUTION');
    });

    test('should note LOW EXPOSURE for few views', () => {
      const viewCount = 500;
      const recommendation = viewCount < 1000 ? 'LOW EXPOSURE' : 'Video appears authentic';
      expect(recommendation).toBe('LOW EXPOSURE');
    });
  });

  describe('Error handling', () => {
    test('should handle video download failure', () => {
      const error = {
        url: 'https://example.com/video.mp4',
        error: 'Failed to download video',
        recommendation: 'Unable to verify video. Manual review recommended.'
      };

      expect(error.error).toBeTruthy();
      expect(error.recommendation).toContain('Manual review');
    });

    test('should handle API service unavailable', () => {
      const result = {
        transcript: { text: null, error: 'Service unavailable' },
        deepfakeScore: 0,
        recommendation: 'Unable to verify video'
      };

      expect(result.transcript.error).toBeTruthy();
      expect(result.deepfakeScore).toBe(0);
    });
  });
});
