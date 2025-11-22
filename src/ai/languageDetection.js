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
    // Constants for heuristic thresholds
    const MIN_WORD_MATCHES = 2;
    const MIN_SCORE_THRESHOLD = 0.2;

    // First check for non-Latin scripts (high confidence indicators)
    // Check Japanese-specific characters (Hiragana/Katakana) before CJK to avoid overlap
    const japaneseMatch = text.match(/[\u3040-\u309f\u30a0-\u30ff]/g);
    if (japaneseMatch && japaneseMatch.length > 0) {
      return {
        language: 'ja',
        confidence: 0.95,
        name: this.supportedLanguages.ja,
        method: 'script-detection'
      };
    }

    const scriptPatterns = {
      ar: /[\u0600-\u06ff]/g,
      ru: /[\u0400-\u04ff]/g,
      ko: /[\uac00-\ud7af]/g,
      hi: /[\u0900-\u097f]/g,
      zh: /[\u4e00-\u9fff]/g  // CJK characters - checked last due to overlap with Japanese
    };

    for (const [lang, pattern] of Object.entries(scriptPatterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return {
          language: lang,
          confidence: 0.95,
          name: this.supportedLanguages[lang] || lang,
          method: 'script-detection'
        };
      }
    }

    // For Latin scripts, check for language-specific diacritics first
    const diacriticPatterns = {
      es: /[áéíóúñ]/gi,
      fr: /[àâçéèêëîïôùûü]/gi,
      de: /[äöüß]/gi,
      pt: /[ãõç]/gi,
      it: /[àèéìòù]/gi
    };

    for (const [lang, pattern] of Object.entries(diacriticPatterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > 0) {
        return {
          language: lang,
          confidence: 0.85,
          name: this.supportedLanguages[lang] || lang,
          method: 'diacritic-detection'
        };
      }
    }

    // Finally, check common words (but require higher threshold due to ambiguity)
    const wordPatterns = {
      es: /\b(el|la|los|las|que|un|una|por|con|no|se|para|está|son)\b/gi,
      fr: /\b(le|les|un|une|et|pour|dans|ce|qui|ne|pas|sont)\b/gi,
      de: /\b(der|die|das|und|von|zu|den|mit|ist|des|dem|auch)\b/gi,
      pt: /\b(os|as|que|do|da|em|um|uma|para|com|por|não|são)\b/gi,
      it: /\b(il|lo|gli|le|di|con|su|per|tra|fra|sono|della)\b/gi
    };

    let bestMatch = null;
    let highestScore = 0;
    const wordCount = text.split(/\s+/).length;

    for (const [lang, pattern] of Object.entries(wordPatterns)) {
      const matches = text.match(pattern);
      if (matches && matches.length > MIN_WORD_MATCHES) {
        const matchCount = matches.length;
        const score = matchCount / wordCount;
        
        if (score > highestScore) {
          highestScore = score;
          bestMatch = {
            language: lang,
            confidence: Math.min(score * 2, 0.75),
            name: this.supportedLanguages[lang] || lang,
            method: 'word-pattern'
          };
        }
      }
    }

    // Return best match if score is significant, otherwise default to English
    if (bestMatch && highestScore > MIN_SCORE_THRESHOLD) {
      return bestMatch;
    }

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
