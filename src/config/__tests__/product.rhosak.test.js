import { config } from '../product.rhosak';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';

describe('Product RHOSAK config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings(initialGraphFilters)).toMatchSnapshot('filters');
    expect(initialGraphSettings).toMatchSnapshot('settings');
  });
});
