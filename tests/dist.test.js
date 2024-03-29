import { products } from '../src/config/products';
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

  it('should have a predictable ephemeral navigation based on route configuration', () => {
    const yamlFile = `./deploy/frontend.yaml`;
    const output = execSync(`yaml2json ${yamlFile}`);
    const yamlObj = JSON.parse(output.toString());
    const yamlRoutes = yamlObj.objects[0].spec.navItems[0].routes;

    const guiRoutes = [
      ...Object.entries(products.sortedConfigs().byGroupIdConfigs).reduce((acc, [, groupedConfigs]) => {
        const updatedConfig = [
          {
            path: `/${groupedConfigs?.[0]?.productPath}`,
            productId: [...groupedConfigs.map(({ productId }) => productId)],
            productGroup: Array.from(new Set([...groupedConfigs.map(({ productGroup }) => productGroup)])),
            productVariants: Array.from(new Set([...groupedConfigs.map(({ productVariants }) => productVariants)]))
              .flat()
              .filter(value => value !== undefined)
          }
        ];

        const flatAliases = groupedConfigs.map(({ aliases }) => [...aliases]).flat(1);
        const aliasedConfigs = [
          ...[...new Set(flatAliases)].map(alias => ({ ...updatedConfig[0], path: `/${alias}` }))
        ];

        return [...acc, ...updatedConfig, ...aliasedConfigs];
      }, [])
    ];

    expect(
      yamlRoutes.map(({ href }) => {
        const updatedRoute = { coverage: 'FALSE' };
        const match = guiRoutes.find(({ path }) => href.split('subscriptions')[1] === path);

        if (match) {
          updatedRoute.coverage = 'TRUE';
        }

        return {
          path: match?.path,
          productId: match?.productId,
          productGroup: match?.productGroup,
          productVariants: match?.productVariants,
          ...updatedRoute
        };
      })
    ).toMatchSnapshot('YAML routes expected covered, missing routes');

    expect(
      guiRoutes.map(({ path, productGroup, productId, productVariants }) => {
        const updatedRoute = { path, productId, productGroup, productVariants, coverage: 'FALSE' };
        const match = yamlRoutes.find(({ href }) => href.split('subscriptions')[1] === path);

        if (match) {
          updatedRoute.coverage = 'TRUE';
        }

        return updatedRoute;
      })
    ).toMatchSnapshot('GUI routes expected covered, missing routes');
  });
});
