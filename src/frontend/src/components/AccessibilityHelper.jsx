// src/frontend/src/components/AccessibilityHelper.jsx
// Accessibility enhancements and ARIA management

import { useEffect } from 'react';
import { enableFocusStyles, reportA11yMetrics, auditAccessibility } from '../utils/a11yChecker';

/**
 * AccessibilityHelper Component
 * Automatically enables accessibility features and provides audit in development mode
 */
export const AccessibilityHelper = ({ debug = false }) => {
  useEffect(() => {
    // Enable focus styles for keyboard navigation
    enableFocusStyles();

    // Run audit in development mode
    if (process.env.NODE_ENV === 'development') {
      const audit = auditAccessibility();
      if (debug) {
        reportA11yMetrics();
      }
    }
  }, [debug]);

  return null; // This component is invisible, just provides effects
};

/**
 * Accessible Button Component
 * Wrapper ensuring proper ARIA attributes
 */
export const A11yButton = ({
  children,
  onClick,
  disabled = false,
  ariaLabel,
  ariaPressed,
  role = 'button',
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      aria-pressed={ariaPressed}
      role={role}
      className="px-4 py-2 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400 disabled:opacity-50"
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Accessible Dialog/Modal Component
 * Manages focus and ARIA attributes for modals
 */
export const A11yDialog = ({
  isOpen,
  onClose,
  title,
  children,
  ariaDescribedBy
}) => {
  const dialogRef = React.useRef();

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Focus dialog when opened
      dialogRef.current.focus();
      
      // Trap focus within dialog
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
      };
      
      dialogRef.current.addEventListener('keydown', handleKeyDown);
      return () => dialogRef.current?.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={ariaDescribedBy}
      tabIndex={-1}
      className="fixed inset-0 bg-black/50 flex items-center justify-center"
    >
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md">
        <h2 id="dialog-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

/**
 * Accessible Form Input Component
 */
export const A11yInput = ({
  id,
  label,
  required = false,
  error,
  hint,
  ariaDescribedBy,
  ...props
}) => {
  const descIds = [hint && `${id}-hint`, error && `${id}-error`, ariaDescribedBy]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium mb-1">
        {label}
        {required && <span aria-label="required" className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={id}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={descIds || undefined}
        className="w-full px-3 py-2 border rounded-lg focus:outline-2 focus:outline-offset-2 focus:outline-blue-400"
        {...props}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-gray-500 mt-1">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Skip to Main Content Link
 * For keyboard navigation (hidden but accessible)
 */
export const SkipToMainContent = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:p-2"
    >
      Skip to main content
    </a>
  );
};

/**
 * Accessible Notification Component with ARIA Live Region
 */
export const A11yNotification = ({ message, type = 'info', role = 'status' }) => {
  return (
    <div
      role={role}
      aria-live="polite"
      aria-atomic="true"
      className={`p-4 rounded-lg ${
        type === 'error' ? 'bg-red-100 text-red-800' :
        type === 'success' ? 'bg-green-100 text-green-800' :
        type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
        'bg-blue-100 text-blue-800'
      }`}
    >
      {message}
    </div>
  );
};

export default AccessibilityHelper;
