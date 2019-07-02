const fs = require('fs');

describe('Index.HTML', () => {
  const loadFile = file => (fs.existsSync(file) && fs.readFileSync(file, { encoding: 'utf-8' })) || '';

  it('should have a specific html output', () => {
    const fileContents = loadFile('./build/index.html');
    const replacedFile = fileContents
      .replace(/</g, '\n<')
      .replace(/"([a-z0-9]*)\/apps\//gi, '*/apps/')
      .replace(/\/([a-z0-9]+)\.([a-z0-9]+)\.chunk.css"/gi, '/*.chunk.css"')
      .replace(/\/([a-z0-9]+)\.([a-z0-9]+)\.chunk.js"/gi, '/*.chunk.js"');

    expect(replacedFile).toMatchSnapshot('html output');
  });
});
