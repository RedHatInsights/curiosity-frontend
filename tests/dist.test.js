const { execSync } = require('child_process');

describe('Build distribution', () => {
  const outputDir = 'dist';

  it('should match a specific file output', () => {
    const output = execSync(`find ./${outputDir} -type f -print0 | xargs -0`);

    const replacedGeneratedFilesMinsHash = output
      .toString()
      .replace(/\s+|\n+|\r+/g, '')
      .replace(new RegExp(`./${outputDir}`, 'gi'), `~./${outputDir}`)
      .replace(new RegExp(`~./${outputDir}/.DS_Store`, 'gi'), '')
      .replace(new RegExp(`~./${outputDir}/(beta/|)config/main.yml`, 'gi'), '')
      .replace(/(?!^)\.[a-z0-9.]+\./gi, '*')
      .split('~')
      .sort();

    expect(replacedGeneratedFilesMinsHash).toMatchSnapshot();
  });

  it('should not contain references to localhost', () => {
    const output = execSync(`grep -roi "localhost:" ./${outputDir} | wc -l`).toString();

    expect(Number.parseInt(output.trim(), 10)).toBe(0);
  });
});
