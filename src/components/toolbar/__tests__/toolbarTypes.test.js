import { toolbarTypes, getOptionsType } from '../toolbarTypes';

describe('ToolbarTypes', () => {
  it('should have specific types', () => {
    expect(toolbarTypes).toMatchSnapshot('toolbarTypes');
  });

  it('should return an output for options selection', () => {
    expect(getOptionsType('sla')).toMatchSnapshot('getOptionsType:sla');
    expect(getOptionsType('usage')).toMatchSnapshot('getOptionsType:usage');
    expect(getOptionsType()).toMatchSnapshot('getOptionsType');
    expect(getOptionsType(null)).toMatchSnapshot('getOptionsType:null');
  });
});
