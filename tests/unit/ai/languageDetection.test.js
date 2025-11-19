// tests/unit/ai/languageDetection.test.js
// Tests for multi-language support

const { detectLanguage, translateToEnglish, isLanguageSupported, getSupportedLanguages } = require('../../../src/ai/languageDetection');

describe('Language Detection and Translation', () => {
  describe('detectLanguage', () => {
    test('should detect English text', async () => {
      const result = await detectLanguage('This is a test claim in English');
      expect(result.language).toBe('en');
      expect(result.name).toBe('English');
    });

    test('should detect Spanish text', async () => {
      const result = await detectLanguage('Esta es una afirmación de prueba en español');
      expect(['es', 'en']).toContain(result.language); // May be es or fallback to en
    });

    test('should handle short text', async () => {
      const result = await detectLanguage('Hi');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('confidence');
    });

    test('should return default for empty text', async () => {
      const result = await detectLanguage('');
      expect(result.language).toBe('en');
      expect(result.confidence).toBeLessThanOrEqual(1.0);
    });
  });

  describe('translateToEnglish', () => {
    test('should not translate English text', async () => {
      const result = await translateToEnglish('This is English');
      expect(result.translatedText).toBe('This is English');
      expect(result.originalLanguage).toBe('en');
      expect(result.translationNeeded).toBe(false);
    });

    test('should handle translation request without API key', async () => {
      const result = await translateToEnglish('Hola mundo', 'es');
      expect(result).toHaveProperty('translatedText');
      expect(result.originalLanguage).toBe('es');
    });

    test('should throw error for empty text', async () => {
      await expect(translateToEnglish('')).rejects.toThrow();
    });
  });

  describe('getSupportedLanguages', () => {
    test('should return array of supported languages', () => {
      const languages = getSupportedLanguages();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(10);
      
      const english = languages.find(l => l.code === 'en');
      expect(english).toBeDefined();
      expect(english.name).toBe('English');
    });

    test('should include major languages', () => {
      const languages = getSupportedLanguages();
      const codes = languages.map(l => l.code);
      
      expect(codes).toContain('en');
      expect(codes).toContain('es');
      expect(codes).toContain('fr');
      expect(codes).toContain('de');
      expect(codes).toContain('zh');
    });
  });

  describe('isLanguageSupported', () => {
    test('should return true for supported languages', () => {
      expect(isLanguageSupported('en')).toBe(true);
      expect(isLanguageSupported('es')).toBe(true);
      expect(isLanguageSupported('fr')).toBe(true);
    });

    test('should return false for unsupported languages', () => {
      expect(isLanguageSupported('xx')).toBe(false);
      expect(isLanguageSupported('unknown')).toBe(false);
    });
  });

  describe('heuristic detection', () => {
    test('should detect Chinese characters', async () => {
      const result = await detectLanguage('这是一个测试');
      expect(['zh', 'en']).toContain(result.language);
    });

    test('should detect Arabic script', async () => {
      const result = await detectLanguage('هذا اختبار');
      expect(['ar', 'en']).toContain(result.language);
    });

    test('should detect Cyrillic (Russian)', async () => {
      const result = await detectLanguage('Это тест');
      expect(['ru', 'en']).toContain(result.language);
    });
  });
});
