import { rhelGraphCardTypes, getDateMenuOptionsType } from '../rhelGraphCardTypes';

describe('RhelGraphCardTypes', () => {
  it('should have specific types', () => {
    expect(rhelGraphCardTypes).toMatchSnapshot('rhelGraphCardTypes');
  });

  it('should return a specific output for getDateMenuOptionsType', () => {
    expect(getDateMenuOptionsType()).toMatchSnapshot('getDateMenuOptionsType');
  });
});
