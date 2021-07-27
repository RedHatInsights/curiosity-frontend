const path = require('path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

/**
 * Setup, and access, a dotenv file and the related set of parameters.
 *
 * @param {string} filePath
 * @returns {void}
 */
const setupDotenvFile = filePath => {
  const dotenvInitial = dotenv.config({ path: filePath });
  dotenvExpand(dotenvInitial);
};

/**
 * Setup and access local and specific dotenv file parameters.
 *
 * @param {object} params
 * @param {string} params.env
 * @param {string} params.relativePath
 * @param {string} params.dotenvNamePrefix
 * @param {boolean} params.setBuildDefaults
 */
const setupDotenvFilesForEnv = ({
  env,
  relativePath = path.resolve(__dirname, '..'),
  dotenvNamePrefix = 'BUILD',
  setBuildDefaults = true
} = {}) => {
  if (env) {
    setupDotenvFile(path.resolve(relativePath, `.env.${env}.local`));
    setupDotenvFile(path.resolve(relativePath, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(relativePath, '.env.local'));
  setupDotenvFile(path.resolve(relativePath, '.env'));

  if (setBuildDefaults) {
    const STATIC_DIR = process.env[`${dotenvNamePrefix}_STATIC_DIR`] || 'public';
    const PUBLIC_PATH = process.env[`${dotenvNamePrefix}_PUBLIC_PATH`] || '/';
    const SRC_DIR = path.resolve(relativePath, process.env[`${dotenvNamePrefix}_SRC_DIR`] || 'src');
    const DIST_DIR = path.resolve(relativePath, process.env[`${dotenvNamePrefix}_DIST_DIR`] || 'dist');
    const HOST = process.env[`${dotenvNamePrefix}_HOST`] || 'localhost';
    const PORT = process.env[`${dotenvNamePrefix}_PORT`] || '3000';
    const DEV_MODE = process.env[`${dotenvNamePrefix}_DEV_MODE`] || undefined;
    const OUTPUT_ONLY = process.env[`_${dotenvNamePrefix}_OUTPUT_ONLY`] === 'true';

    process.env[`_${dotenvNamePrefix}_ENV`] = process.env.NODE_ENV;
    process.env[`_${dotenvNamePrefix}_STATIC_DIR`] = STATIC_DIR;
    process.env[`_${dotenvNamePrefix}_RELATIVE_DIRNAME`] = relativePath;
    process.env[`_${dotenvNamePrefix}_PUBLIC_PATH`] = PUBLIC_PATH;
    process.env[`_${dotenvNamePrefix}_SRC_DIR`] = SRC_DIR;
    process.env[`_${dotenvNamePrefix}_DIST_DIR`] = DIST_DIR;
    process.env[`_${dotenvNamePrefix}_HOST`] = HOST;
    process.env[`_${dotenvNamePrefix}_PORT`] = PORT;
    process.env[`_${dotenvNamePrefix}_OUTPUT_ONLY`] = OUTPUT_ONLY;
    process.env[`_${dotenvNamePrefix}_DEV_MODE`] = DEV_MODE;
  }
};

module.exports = { setupDotenvFilesForEnv };
