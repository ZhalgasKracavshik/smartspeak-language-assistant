
// Input Sanitizer Service
// Provides utility functions to sanitize user input and prevent XSS attacks.

export const inputSanitizer = {
  /**
   * Removes all HTML tags from the input string.
   * Useful for plain text inputs like names, titles, etc.
   */
  sanitizeText: (input: string): string => {
    if (!input) return '';
    return input.replace(/<[^>]*>/g, '');
  },

  /**
   * Escapes HTML special characters to prevent them from being interpreted as code.
   * Useful when displaying user input that might contain special characters.
   */
  escapeHTML: (input: string): string => {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Validates and sanitizes an email address.
   * Returns null if invalid.
   */
  sanitizeEmail: (email: string): string | null => {
    if (!email) return null;
    const trimmed = email.trim().toLowerCase();
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return null;
    return inputSanitizer.escapeHTML(trimmed);
  },

  /**
   * Sanitizes a URL to ensure it uses a safe protocol (http/https).
   * Returns '#' if unsafe.
   */
  sanitizeURL: (url: string): string => {
    if (!url) return '#';
    const trimmed = url.trim();
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return inputSanitizer.escapeHTML(trimmed);
    }
    return '#';
  }
};
