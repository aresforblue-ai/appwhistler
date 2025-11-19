// src/config/secrets.js
// Centralized secrets/config loader with pluggable providers (ENV, file, Vault/AWS placeholder)

const fs = require('fs');
const path = require('path');

let secretsCache = null;
let initialized = false;

const PROVIDERS = {
  env: () => ({}),
  file: () => {
    const filePath = process.env.SECRETS_FILE || path.join(process.cwd(), 'secrets.json');
    if (!fs.existsSync(filePath)) {
      throw new Error(`Secrets file not found at ${filePath}`);
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  },
  vault: () => {
    console.warn('Vault provider not yet implemented. Ensure secrets are supplied via environment.');
    return {};
  },
  aws: () => {
    console.warn('AWS Secrets Manager provider not yet implemented. Ensure secrets are supplied via environment.');
    return {};
  }
};

function resolveProvider() {
  if (process.env.SECRETS_PROVIDER) {
    return process.env.SECRETS_PROVIDER.toLowerCase();
  }
  return process.env.NODE_ENV === 'production' ? 'vault' : 'env';
}

function loadSecrets() {
  if (initialized) {
    return secretsCache;
  }

  const provider = resolveProvider();
  const fetcher = PROVIDERS[provider] || PROVIDERS.env;

  try {
    const externalSecrets = fetcher();

    // Merge into process.env for backwards compatibility
    Object.entries(externalSecrets).forEach(([key, value]) => {
      process.env[key] = value;
    });
  } catch (error) {
    console.error(`Failed to load secrets from provider '${provider}':`, error.message);
    if (provider !== 'env') {
      throw error;
    }
  }

  secretsCache = { ...process.env };
  initialized = true;
  return secretsCache;
}

function ensureInitialized() {
  if (!initialized) {
    secretsCache = { ...process.env };
    initialized = true;
  }
}

function getSecret(key, fallback = undefined) {
  ensureInitialized();
  if (Object.prototype.hasOwnProperty.call(secretsCache, key)) {
    return secretsCache[key];
  }
  return fallback;
}

function requireSecret(key) {
  const value = getSecret(key);
  if (value === undefined || value === null || value === '') {
    throw new Error(`Missing required secret: ${key}`);
  }
  return value;
}

function getNumber(key, fallback = undefined) {
  const raw = getSecret(key, fallback);
  if (raw === undefined || raw === null) return fallback;
  const value = Number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Secret ${key} must be a number`);
  }
  return value;
}

function getBoolean(key, fallback = false) {
  const raw = getSecret(key);
  if (raw === undefined || raw === null) return fallback;
  if (typeof raw === 'boolean') return raw;
  return ['true', '1', 'yes', 'on'].includes(String(raw).toLowerCase());
}

function getArray(key, delimiter = ',', fallback = []) {
  const raw = getSecret(key);
  if (!raw) return fallback;
  if (Array.isArray(raw)) return raw;
  return String(raw)
    .split(delimiter)
    .map(part => part.trim())
    .filter(Boolean);
}

function getDatabaseConfig() {
  return {
    host: getSecret('DB_HOST', 'localhost'),
    port: getNumber('DB_PORT', 5432),
    database: getSecret('DB_NAME', 'appwhistler'),
    user: getSecret('DB_USER', 'postgres'),
    password: getSecret('DB_PASSWORD'),
    max: getNumber('DB_POOL_MAX', 20),
    idleTimeoutMillis: getNumber('DB_IDLE_TIMEOUT_MS', 30000),
    connectionTimeoutMillis: getNumber('DB_CONN_TIMEOUT_MS', 2000)
  };
}

module.exports = {
  loadSecrets,
  getSecret,
  requireSecret,
  getNumber,
  getBoolean,
  getArray,
  getDatabaseConfig
};
