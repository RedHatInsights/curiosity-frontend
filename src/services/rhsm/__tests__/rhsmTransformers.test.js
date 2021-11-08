import { rhsmTranformers } from '../rhsmTranformers';

describe('RHSM Transformers', () => {
  it('should have specific RHSM response transformers', () => {
    expect(rhsmTranformers).toMatchSnapshot('specific transformers');
  });

  it('should attempt to parse a tally response', () => {
    expect(rhsmTranformers.tally()).toMatchSnapshot('tally');
  });
});
