import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewMissing } from '../productViewMissing';
import { Redirect } from '../../router';

describe('ProductViewMissing Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      availableProductsRedirect: 1
    };
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render a predictable set of product cards', () => {
    const props = {
      availableProductsRedirect: 1
    };

    mockWindowLocation(
      () => {
        const component = shallow(<ProductViewMissing {...props} />);
        expect(component).toMatchSnapshot('non-connected');
      },
      {
        url: 'https://ci.foo.redhat.com/openshift/subscriptions/'
      }
    );
  });

  it('should redirect when there are limited product cards', () => {
    const props = {};

    mockWindowLocation(() => {
      const component = shallow(<ProductViewMissing {...props} />);
      expect(component.find(Redirect).html()).toMatchSnapshot('redirect');
    });
  });
});
