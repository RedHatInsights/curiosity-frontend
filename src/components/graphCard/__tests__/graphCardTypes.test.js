import { graphCardTypes, getGranularityOptionsType } from '../graphCardTypes';

describe('RhelGraphCardTypes', () => {
  it('should have specific types', () => {
    expect(graphCardTypes).toMatchSnapshot('rhelGraphCardTypes');
  });

  it('should return an output for granularity selection', () => {
    expect(getGranularityOptionsType('default')).toMatchSnapshot('getGranularityOptionsType:default');
    expect(getGranularityOptionsType()).toMatchSnapshot('getGranularityOptionsType');
  });
});
