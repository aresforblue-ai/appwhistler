// src/frontend/src/utils/a11yChecker.js
// Runtime accessibility validation utility (development mode)

/**
 * Check color contrast ratio (WCAG 2.1 AA minimum 4.5:1)
 */
export const getContrastRatio = (rgbColor1, rgbColor2) => {
  const getLuminance = (rgb) => {
    const [r, g, b] = rgb.match(/\d+/g).map(x => parseInt(x) / 255);
    const [rs, gs, bs] = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const l1 = getLuminance(rgbColor1);
  const l2 = getLuminance(rgbColor2);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio.toFixed(2);
};

/**
 * Validate color contrast against WCAG standards
 */
export const validateContrast = (bgColor, textColor, level = 'AA') => {
  const ratio = parseFloat(getContrastRatio(bgColor, textColor));
  const minRatio = level === 'AAA' ? 7 : 4.5;
  const pass = ratio >= minRatio;
  
  return {
    ratio: ratio.toFixed(2),
    pass,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail',
    message: pass ? `✅ Pass (${ratio}:1 meets WCAG ${level})` : `❌ Fail (${ratio}:1, need ${minRatio}:1)`
  };
};

/**
 * Audit page for accessibility issues (development mode only)
 */
export const auditAccessibility = () => {
  if (process.env.NODE_ENV !== 'development') return;

  const issues = [];

  // Check for images without alt text
  document.querySelectorAll('img').forEach(img => {
    if (!img.alt || img.alt.trim().length === 0) {
      issues.push({
        type: 'IMAGE_NO_ALT',
        element: img,
        message: `Image missing alt text: ${img.src}`
      });
    }
  });

  // Check for buttons without aria-label
  document.querySelectorAll('button').forEach(btn => {
    const hasLabel = btn.textContent?.trim().length > 0 || 
                     btn.getAttribute('aria-label') ||
                     btn.getAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push({
        type: 'BUTTON_NO_LABEL',
        element: btn,
        message: 'Button missing accessible label'
      });
    }
  });

  // Check for links without text
  document.querySelectorAll('a').forEach(link => {
    const hasText = link.textContent?.trim().length > 0 || 
                    link.getAttribute('aria-label') ||
                    link.title;
    if (!hasText) {
      issues.push({
        type: 'LINK_NO_TEXT',
        element: link,
        message: 'Link missing text or aria-label'
      });
    }
  });

  // Check for form inputs without labels
  document.querySelectorAll('input, textarea, select').forEach(input => {
    const id = input.id;
    const hasLabel = id && document.querySelector(`label[for="${id}"]`) ||
                     input.getAttribute('aria-label') ||
                     input.getAttribute('aria-labelledby');
    if (!hasLabel) {
      issues.push({
        type: 'INPUT_NO_LABEL',
        element: input,
        message: 'Form input missing label'
      });
    }
  });

  // Check for heading structure
  const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    if (level > lastLevel + 1 && lastLevel > 0) {
      issues.push({
        type: 'HEADING_STRUCTURE',
        element: heading,
        message: `Heading structure skip detected: ${heading.tagName}`
      });
    }
    lastLevel = level;
  });

  if (issues.length > 0) {
    console.warn(`♿ Accessibility Issues (${issues.length}):`);
    issues.forEach(issue => {
      console.warn(`  [${issue.type}] ${issue.message}`, issue.element);
    });
  }

  return { issues, pass: issues.length === 0 };
};

/**
 * Check keyboard navigability of element
 */
export const isKeyboardAccessible = (element) => {
  const focusableSelectors = [
    'a',
    'button',
    'input',
    'select',
    'textarea',
    '[tabindex]',
    '[role="button"]',
    '[role="link"]'
  ].join(',');

  return element.matches(focusableSelectors) || 
         element.querySelector(focusableSelectors) !== null;
};

/**
 * Enable focus visibility for keyboard navigation
 */
export const enableFocusStyles = () => {
  if (typeof window === 'undefined') return;

  const style = document.createElement('style');
  style.textContent = `
    *:focus-visible {
      outline: 2px solid #60a5fa;
      outline-offset: 2px;
    }

    /* Ensure visible focus on all interactive elements */
    button:focus-visible,
    a:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
      outline: 2px solid #60a5fa;
      outline-offset: 2px;
    }

    /* Respect reduced motion preference */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  `;
  document.head.appendChild(style);
};

/**
 * Report accessibility metrics
 */
export const reportA11yMetrics = () => {
  if (process.env.NODE_ENV !== 'development') return null;

  const audit = auditAccessibility();
  const metrics = {
    totalImages: document.querySelectorAll('img').length,
    imagesWithAlt: document.querySelectorAll('img[alt]').length,
    totalButtons: document.querySelectorAll('button').length,
    totalLinks: document.querySelectorAll('a').length,
    totalFormInputs: document.querySelectorAll('input, textarea, select').length,
    formInputsWithLabels: document.querySelectorAll('input[id], textarea[id], select[id]').filter(
      el => document.querySelector(`label[for="${el.id}"]`)
    ).length,
    accessibilityScore: 100 - (audit.issues.length * 5), // Deduct 5 points per issue
    issues: audit.issues.length
  };

  console.table(metrics);
  return metrics;
};

export default {
  getContrastRatio,
  validateContrast,
  auditAccessibility,
  isKeyboardAccessible,
  enableFocusStyles,
  reportA11yMetrics
};
