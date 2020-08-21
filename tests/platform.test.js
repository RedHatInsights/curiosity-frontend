const { execSync } = require('child_process');
const packageJson = require('../package');

describe('Platform Configuration, Build', () => {
  it('should have a name reference that matches configuration', () => {
    const envFile = './.env';
    const { appname } = packageJson.insights;

    const output = execSync(`grep -w "REACT_APP_UI_NAME=${appname}" ${envFile}`);
    expect(output.toString().split('\n')).toMatchSnapshot('ui name');
  });

  it('should have path references that match configuration', () => {
    const envFile = './.env';
    const { appname } = packageJson.insights;

    const output = execSync(`grep "\\/${appname}\\/" ${envFile}`);
    expect(output.toString().split('\n')).toMatchSnapshot('path references');
  });

  it('should have a proxy configuration with path references that match configuration', () => {
    const proxyFile = './config/spandx.config.js';
    const { appname } = packageJson.insights;

    const output = execSync(`grep "\\/${appname}'" ${proxyFile}`);
    expect(
      output
        .toString()
        .split('\n')
        .map(value => value.trim())
    ).toMatchSnapshot('proxy references');
  });

  it('should use direct imports for platform components, with exceptions', () => {
    const srcDir = 'src';
    const output = execSync(
      `echo "$(cd ./${srcDir} && git grep -n -E "(@redhat-cloud-services/frontend-components/components/)")"`
    );

    expect(
      output
        .toString()
        .trim()
        .split(/[\n\r]/g)
        .filter(str => !/\/(cjs|esm)\//.test(str))
    ).toMatchSnapshot('direct import exceptions');
  });
});
