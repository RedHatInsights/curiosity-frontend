import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewMissing } from '../productViewMissing';

describe('ProductViewMissing Component', () => {
  const mockWindowLocation = async ({ url, callback }) => {
    const updatedUrl = new URL(url);
    const { location } = window;
    delete window.location;
    // mock
    window.location = {
      href: updatedUrl.href,
      search: updatedUrl.search,
      hash: updatedUrl.hash,
      pathname: updatedUrl.pathname
    };
    await callback();
    // restore
    window.location = location;
  };

  it('should render a non-connected component', () => {
    const props = {};
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a predictable set of product cards', () => {
    const props = {};

    mockWindowLocation({
      url: 'https://ci.foo.redhat.com/loremIpsum/dolorSit/',
      callback: () => {
        const component = shallow(<ProductViewMissing {...props} />);
        expect(component).toMatchSnapshot('non-connected');
      }
    });
  });
});
