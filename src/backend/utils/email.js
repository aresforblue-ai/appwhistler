// src/backend/utils/email.js
// Minimal email helper for password reset notifications (logs to console in lieu of SMTP)

const { getSecret } = require('../../config/secrets');

const PASSWORD_RESET_BASE_URL = getSecret('PASSWORD_RESET_BASE_URL', 'http://localhost:3000/reset-password');

async function sendPasswordResetEmail(recipient, token) {
  const resetLink = `${PASSWORD_RESET_BASE_URL}?token=${encodeURIComponent(token)}`;
  // Placeholder email delivery: log to console so developers can inspect the link
  console.log(`\n📧 Password reset requested for ${recipient}\nReset Link: ${resetLink}\n`);
  return { recipient, resetLink };
}

module.exports = {
  sendPasswordResetEmail
};
