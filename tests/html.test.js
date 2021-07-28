const fs = require('fs');

describe('Index.HTML', () => {
  const outputDir = 'dist';
  const loadFile = file => (fs.existsSync(file) && fs.readFileSync(file, { encoding: 'utf-8' })) || '';

  it('should have a specific html output', () => {
    const fileContents = loadFile(`./${outputDir}/index.html`);
    const replacedFile = fileContents
      .replace(/</g, '\n<')
      .replace(/"([/a-z0-9]*)\/apps\//gi, '"*/apps/')
      .replace(/\/([a-z0-9]+)\.([a-z0-9]+)\.chunk.css"/gi, '/*.chunk.css"')
      .replace(/\/([a-z0-9]+)\.([a-z0-9]+)\.chunk.js"/gi, '/*.chunk.js"')
      .replace(/\/([a-z]+)\.([a-z0-9]+)\.js"/gi, '/$1.*.js"')
      .replace(/<script>([\d\D])+?<\/script>/gi, '<script>/* filtered */</script>');

    expect(replacedFile).toMatchSnapshot('html output');
  });
});
