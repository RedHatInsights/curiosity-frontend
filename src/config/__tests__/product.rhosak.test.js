import { config } from '../product.rhosak';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';

describe('Product RHOSAK config', () => {
  it('should apply graph configuration', () => {
    const { initialGraphFilters, initialGraphSettings } = config;

    expect(generateChartSettings(initialGraphFilters)).toMatchSnapshot('filters');
    expect(initialGraphSettings).toMatchSnapshot('settings');
  });

  it('should handle a custom yAxisTickFormat for floating points', () => {
    const generateTicks = (method = config.initialGraphSettings.yAxisTickFormat) => {
      const ticks = {};
      for (let i = 0.00001345; i < 13; i++) {
        const multiplier = i < 1 ? i : Math.pow(10, i);
        for (let k = 1; k < 16; k++) {
          const incrementMultiplier = k * multiplier;
          ticks[incrementMultiplier] = method({ tick: incrementMultiplier });
        }
      }
      return ticks;
    };

    expect(generateTicks()).toMatchSnapshot('yAxisTickFormat');
  });
});
