const fs = require('fs');

describe('Version', () => {
  const loadFile = file => (fs.existsSync(file) && fs.readFileSync(file, { encoding: 'utf-8' })) || '';

  it('should have a specific version output', () => {
    const fileContents = loadFile('./.env.production.local');
    expect(/UI_VERSION=[0-9]{1,7}\.[0-9]{1,7}\.[0-9]{1,7}\.[a-z0-9]{7}/i.test(fileContents.trim())).toBe(true);
  });
});
