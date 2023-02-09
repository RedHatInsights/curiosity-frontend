import React from 'react';
import { shallow } from 'enzyme';
import { ProductViewMissing } from '../productViewMissing';

describe('ProductViewMissing Component', () => {
  it('should render a basic component', () => {
    const props = {
      availableProductsRedirect: 1
    };
    const component = shallow(<ProductViewMissing {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should redirect when there are limited product cards', async () => {
    const mockPush = jest.fn();
    const props = {
      availableProductsRedirect: 200,
      useHistory: () => ({ push: mockPush })
    };

    await mountHookComponent(<ProductViewMissing {...props} />);
    expect(mockPush.mock.calls).toMatchSnapshot('redirect action');
  });
});
