const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openApiSpecs = [
  {
    file: 'https://raw.githubusercontent.com/RedHatInsights/rhsm-subscriptions/develop/api/rhsm-subscriptions-api-spec.yaml',
    outputDir: `${process.cwd()}/.openapi`,
    outputFileName: 'rhsm.yaml',
    port: 5050
  }
];
const cache = {
  tryAgainCount: 0
};

/**
 * Set display colors
 *
 * @param {string} str
 * @param {string} color
 * @returns {string}
 */
const setColor = (str, color = 'reset') => {
  const colors = {
    blue: '\x1b[34m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    reset: '\x1b[0m',
    yellow: '\x1b[33m'
  };

  return `${colors[color.toLowerCase()] || colors.reset}${str}${colors.reset}`;
};

/**
 * Express serve local files
 *
 * @param {Array} files
 */
const serveDocs = (files = []) => {
  files.forEach(yamlFile => {
    if (fs.existsSync(yamlFile.file)) {
      const app = express();

      app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(YAML.load(yamlFile.file)));

      app.listen(yamlFile.port, () => {
        console.log(
          `You can now view API docs for ${yamlFile.desc} in the browser.\n  Open: http://localhost:${yamlFile.port}/docs/api\n`
        );
      });
    } else if (cache.tryAgainCount < 10) {
      setTimeout(() => {
        console.info(`Locating ${yamlFile.desc}...`);
        cache.tryAgainCount += 1;
        serveDocs(yamlFile.file, yamlFile.port);
      }, 1000);
    } else {
      console.warn(setColor(`${yamlFile.desc} doesn't exist`, 'yellow'));
    }
  });
};

/**
 * Load remote files and cache, or just confirm a local file.
 *
 * @param {Array} inputPaths
 * @returns {Array}
 */
const getLocalApiSpec = (inputPaths = []) => {
  const outputPaths = [];

  inputPaths.forEach(inputPath => {
    let outputPath = inputPath.file;
    const inputPathFile = inputPath.file.split('/').pop();

    if (/^http/i.test(inputPath.file)) {
      const warning = `Unable to load ${inputPathFile} -> ${inputPath.outputFileName}, checking cache...`;
      outputPath = path.join(inputPath.outputDir, inputPath.outputFileName);

      try {
        const outputYaml = execSync(`curl --silent ${inputPath.file}`);

        if (!fs.existsSync(inputPath.outputDir)) {
          fs.mkdirSync(inputPath.outputDir);
        }

        if (/openapi/i.test(outputYaml.toString())) {
          fs.writeFileSync(outputPath, outputYaml);
        } else {
          console.warn(setColor(warning, 'yellow'));
        }
      } catch (e) {
        console.warn(setColor(warning, 'yellow'));
      }
    }

    if (fs.existsSync(outputPath)) {
      console.log(setColor(`Success -> ${inputPathFile}`, 'green'));
      outputPaths.push({ file: outputPath, port: inputPath.port, desc: inputPathFile });
    } else {
      console.warn(setColor(`Failed -> ${inputPathFile}`, 'red'));
    }
  });

  return outputPaths;
};

serveDocs(getLocalApiSpec(openApiSpecs));
