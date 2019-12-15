import { rhelGraphCardTypes, getGranularityOptionsType } from '../rhelGraphCardTypes';

describe('RhelGraphCardTypes', () => {
  it('should have specific types', () => {
    expect(rhelGraphCardTypes).toMatchSnapshot('rhelGraphCardTypes');
  });

  it('should return an output for granularity selection', () => {
    expect(getGranularityOptionsType('default')).toMatchSnapshot('getGranularityOptionsType:default');
    expect(getGranularityOptionsType()).toMatchSnapshot('getGranularityOptionsType');
  });
});
