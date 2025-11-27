// src/ai/languageDetection.js
// Multi-language support for fact-checking in non-English languages

const axios = require('axios');
const { getSecret } = require('../config/secrets');

/**
 * Language detection and translation service
 * Supports fact-checking in multiple languages
 */
class LanguageService {
  constructor() {
    // Google Translate API (Cloud Translation API v3)
    this.googleApiKey = getSecret('GOOGLE_TRANSLATE_API_KEY');
    this.googleApiUrl = 'https://translation.googleapis.com/language/translate/v2';
    
    // Supported languages for fact-checking
    this.supportedLanguages = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      zh: 'Chinese (Simplified)',
      ja: 'Japanese',
      ar: 'Arabic',
      pt: 'Portuguese',
      ru: 'Russian',
      hi: 'Hindi',
      it: 'Italian',
      ko: 'Korean'
    };
  }

  /**
   * Detect language of text using Google's API or local heuristics
   * @param {string} text - Text to analyze
   * @returns {object} { language: 'en', confidence: 0.99, name: 'English' }
   */
  async detectLanguage(text) {
    if (!text || text.trim().length < 10) {
      return { language: 'en', confidence: 0.5, name: 'English' };
    }

    // Try Google Cloud Translation API first
    if (this.googleApiKey) {
      try {
        const response = await axios.post(
          `${this.googleApiUrl}/detect`,
          null,
          {
            params: {
              key: this.googleApiKey,
              q: text
            },
            timeout: 5000
          }
        );

        const detection = response.data.data.detections[0][0];
        return {
          language: detection.language,
          confidence: detection.confidence,
          name: this.supportedLanguages[detection.language] || detection.language
        };
      } catch (error) {
        console.warn('Google Translate API detection failed, using fallback:', error.message);
      }
    }

    // Fallback: Simple heuristic-based detection
    return this._detectLanguageHeuristic(text);
  }

  /**
   * Translate text to English for fact-checking
   * @param {string} text - Text to translate
   * @param {string} sourceLanguage - Source language code (auto-detected if not provided)
   * @returns {object} { translatedText: '...', originalLanguage: 'es', confidence: 0.95 }
   */
  async translateToEnglish(text, sourceLanguage = null) {
    if (!text) {
      throw new Error('Text is required for translation');
    }

    // Detect language if not provided
    if (!sourceLanguage) {
      const detection = await this.detectLanguage(text);
      sourceLanguage = detection.language;
      
      // Already in English, no translation needed
      if (sourceLanguage === 'en') {
        return {
          translatedText: text,
          originalLanguage: 'en',
          confidence: 1.0,
          translationNeeded: false
        };
      }
    }

    // Use Google Translate API
    if (this.googleApiKey) {
      try {
        const response = await axios.post(
          this.googleApiUrl,
          null,
          {
            params: {
              key: this.googleApiKey,
              q: text,
              source: sourceLanguage,
              target: 'en',
              format: 'text'
            },
            timeout: 10000
          }
        );

        const translation = response.data.data.translations[0];
        return {
          translatedText: translation.translatedText,
          originalLanguage: sourceLanguage,
          confidence: 0.95,
          translationNeeded: true
        };
      } catch (error) {
        console.error('Translation failed:', error.message);
        throw new Error('Translation service unavailable');
      }
    }

    // No API key available
    console.warn('⚠️  GOOGLE_TRANSLATE_API_KEY not set. Cannot translate non-English content.');
    return {
      translatedText: text,
      originalLanguage: sourceLanguage,
      confidence: 0,
      translationNeeded: true,
      error: 'Translation service not configured'
    };
  }

  /**
   * Translate English verdict back to original language
   * @param {string} verdictText - English verdict text
   * @param {string} targetLanguage - Target language code
   * @returns {string} Translated verdict
   */
  async translateVerdict(verdictText, targetLanguage) {
    if (!targetLanguage || targetLanguage === 'en') {
      return verdictText;
    }

    if (!this.googleApiKey) {
      return verdictText; // Return English if no translation available
    }

    try {
      const response = await axios.post(
        this.googleApiUrl,
        null,
        {
          params: {
            key: this.googleApiKey,
            q: verdictText,
            source: 'en',
            target: targetLanguage,
            format: 'text'
          },
          timeout: 5000
        }
      );

      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Verdict translation failed:', error.message);
      return verdictText; // Fallback to English
    }
  }

  /**
   * Simple heuristic-based language detection (fallback)
   * @private
   */
  _detectLanguageHeuristic(text) {
    // Check for English first using common English words
    // These words are very distinctive for English and unlikely to appear in other languages
    const englishPattern = /\b(the|this|is|are|was|were|been|being|have|has|had|do|does|did|will|would|could|should|might|must|shall|can|may|a|an|and|but|or|not|be|to|of|for|with|that|it|you|he|she|they|we|I|my|your|his|her|their|our|its|what|which|who|whom|whose|where|when|why|how|all|each|every|both|few|more|most|other|some|such|no|nor|too|very|just|also|only)\b/gi;
    const englishMatches = text.match(englishPattern);
    if (englishMatches && englishMatches.length >= 2) {
      const wordCount = text.split(/\s+/).length;
      const matchRatio = englishMatches.length / wordCount;
      if (matchRatio >= 0.2) {
        return {
          language: 'en',
          confidence: Math.min(matchRatio * 2, 0.9),
          name: 'English',
          method: 'heuristic'
        };
      }
    }

    const patterns = {
      // Spanish: common words and diacritics
      es: /\b(el|la|los|las|de|que|es|un|una|por|con|no|se|para)\b|[áéíóúñ]/i,
      // French: common words and diacritics
      fr: /\b(le|la|les|de|un|une|et|est|pour|dans|ce|qui|ne|pas)\b|[àâçéèêëîïôùûü]/i,
      // German: common words and characters
      de: /\b(der|die|das|und|von|zu|den|mit|ist|des|dem)\b|[äöüß]/i,
      // Chinese: CJK characters
      zh: /[\u4e00-\u9fff]/,
      // Japanese: Hiragana, Katakana, Kanji
      ja: /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/,
      // Arabic: Arabic script
      ar: /[\u0600-\u06ff]/,
      // Russian: Cyrillic script
      ru: /[\u0400-\u04ff]/,
      // Korean: Hangul
      ko: /[\uac00-\ud7af]/,
      // Portuguese: common words
      pt: /\b(o|a|os|as|de|que|do|da|em|um|uma|para|com|não|por)\b|[ãõç]/i,
      // Hindi: Devanagari script
      hi: /[\u0900-\u097f]/,
      // Italian: common words
      it: /\b(il|lo|la|i|gli|le|di|da|con|su|per|tra|fra)\b|[àèéìòù]/i
    };

    // Test each pattern
    for (const [lang, pattern] of Object.entries(patterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        // Calculate confidence based on match frequency
        const matchCount = matches.length;
        const wordCount = text.split(/\s+/).length;
        const confidence = Math.min(matchCount / wordCount * 2, 0.9);
        
        return {
          language: lang,
          confidence: confidence,
          name: this.supportedLanguages[lang] || lang,
          method: 'heuristic'
        };
      }
    }

    // Default to English if no matches
    return {
      language: 'en',
      confidence: 0.5,
      name: 'English',
      method: 'default'
    };
  }

  /**
   * Get list of supported languages
   * @returns {array} [{ code: 'en', name: 'English' }, ...]
   */
  getSupportedLanguages() {
    return Object.entries(this.supportedLanguages).map(([code, name]) => ({
      code,
      name
    }));
  }

  /**
   * Check if language is supported for fact-checking
   * @param {string} languageCode - ISO 639-1 language code
   * @returns {boolean}
   */
  isLanguageSupported(languageCode) {
    return languageCode in this.supportedLanguages;
  }
}

// Singleton instance
const languageService = new LanguageService();

module.exports = {
  LanguageService,
  languageService,
  detectLanguage: (text) => languageService.detectLanguage(text),
  translateToEnglish: (text, sourceLang) => languageService.translateToEnglish(text, sourceLang),
  translateVerdict: (text, targetLang) => languageService.translateVerdict(text, targetLang),
  getSupportedLanguages: () => languageService.getSupportedLanguages(),
  isLanguageSupported: (lang) => languageService.isLanguageSupported(lang)
};
