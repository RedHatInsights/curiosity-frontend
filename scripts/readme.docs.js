const { writeFileSync } = require('fs');
const { join } = require('path');
const jsdoc2md = require('jsdoc-to-markdown');

const generateReadMe = ({ input, output } = {}) => {
  try {
    const outputPath = join(process.cwd(), output);
    const docs = jsdoc2md.renderSync({ files: input, 'no-gfm': true });
    writeFileSync(outputPath, docs);
    console.info(`Generate README success > ${input}`);
  } catch (e) {
    console.warn(`Generate README failed > ${input} > `, e.message);
  }
};

((files = []) => {
  Promise.all(files.map(obj => generateReadMe(obj)));
})([
  { input: './src/*.js', output: './src/README.md' },
  { input: './src/common/*.js', output: './src/common/README.md' },
  { input: './src/components/*/*.js', output: './src/components/README.md' },
  // { input: './src/config/*/*.js', output: './src/config/README.md' },
  { input: './src/hooks/*.js', output: './src/hooks/README.md' },
  { input: './src/redux/**/*.js', output: './src/redux/README.md' },
  { input: './src/services/**/*.js', output: './src/services/README.md' }
]);
