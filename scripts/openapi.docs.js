const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const openApiSpecs = [
  {
    file:
      'https://raw.githubusercontent.com/RedHatInsights/rhsm-subscriptions/master/api/rhsm-subscriptions-api-spec.yaml',
    outputDir: `${process.cwd()}/.openapi`,
    outputFileName: 'rhsm.yaml',
    port: 5050
  }
];
const cache = {
  tryAgainCount: 0
};

const serveDocs = (files = []) => {
  files.forEach(yamlFile => {
    if (fs.existsSync(yamlFile.file)) {
      const app = express();

      app.use('/docs/api', swaggerUi.serve, swaggerUi.setup(YAML.load(yamlFile.file)));

      app.listen(yamlFile.port, () => {
        console.log(
          `\nYou can now view API docs in the browser.\n  Open: http://localhost:${yamlFile.port}/docs/api\n`
        );
      });
    } else if (cache.tryAgainCount < 10) {
      setTimeout(() => {
        console.info(`Locating ${yamlFile.file}...`);
        cache.tryAgainCount += 1;
        serveDocs(yamlFile.file, yamlFile.port);
      }, 1000);
    } else {
      console.info(`${yamlFile.file} doesn't exist`);
    }
  });
};

const getLocalApiSpec = (inputPaths = []) => {
  const outputPaths = [];

  inputPaths.forEach(inputPath => {
    const outputPath = path.join(inputPath.outputDir, inputPath.outputFileName);

    if (fs.existsSync(outputPath)) {
      outputPaths.push({ file: outputPath, port: inputPath.port });
    } else {
      if (!fs.existsSync(inputPath.outputDir)) {
        fs.mkdirSync(inputPath.outputDir);
      }

      execSync(`curl ${inputPath.file} > ${outputPath}`);

      outputPaths.push({ file: outputPath, port: inputPath.port });
    }
  });

  return outputPaths;
};

serveDocs(getLocalApiSpec(openApiSpecs));
