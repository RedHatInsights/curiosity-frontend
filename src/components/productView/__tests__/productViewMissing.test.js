import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewMissing } from '../productViewMissing';

describe('ProductViewMissing Component', () => {
  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a predictable set of product cards', () => {
    const props = {};

    mockWindowLocation(
      () => {
        const component = shallow(<ProductViewMissing {...props} />);
        expect(component).toMatchSnapshot('non-connected');
      },
      {
        url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/'
      }
    );
  });
});
