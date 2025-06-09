const { execSync } = require('child_process');
const packageJson = require('../package.json');

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

describe('Frontend operator', () => {
  let yamlOutput;

  beforeAll(() => {
    const yamlFile = `./deploy/frontend.yaml`;
    const output = execSync(`yaml2json ${yamlFile}`);
    yamlOutput = JSON.parse(output.toString());
  });

  it('should have a consistent configuration', () => {
    expect(yamlOutput.objects.length).toBe(1);
    expect(yamlOutput.objects[0].metadata.name).toBe(packageJson.insights.appname);
    expect(yamlOutput.objects[0].spec.module).toMatchSnapshot('module');
  });

  it('should have a consistent set of serviceTiles', () => {
    expect(yamlOutput.objects[0].spec.serviceTiles).toMatchSnapshot('tiles');
  });

  it('should have a consistent set of searchEntries', () => {
    expect(yamlOutput.objects[0].spec.searchEntries).toMatchSnapshot('search');
  });

  it('should have a consistent set of bundleSegments', () => {
    expect(yamlOutput.objects[0].spec.bundleSegments).toMatchSnapshot('segments');
  });
});
