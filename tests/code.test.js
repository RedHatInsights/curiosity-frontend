const { execSync } = require('child_process');

describe('General code checks', () => {
  const srcDir = 'src';

  it('should only have specific console.[warn|log|info|error] methods', () => {
    const output = execSync(
      `echo "$(cd ./${srcDir} && git grep -n -E "(console.warn|console.log|console.info|console.error)")"`
    );

    expect(
      output
        .toString()
        .trim()
        .split(/[\n\r]/g)
    ).toMatchSnapshot('console methods');
  });
});
