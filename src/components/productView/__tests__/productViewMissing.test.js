import React from 'react';
import { shallow } from 'enzyme';
import * as reactRedux from 'react-redux';
import { ProductViewMissing } from '../productViewMissing';

describe('ProductViewMissing Component', () => {
  const useDispatchMock = jest.spyOn(reactRedux, 'useDispatch');

  afterEach(() => {
    useDispatchMock.mockClear();
  });

  it('should render a non-connected component', () => {
    useDispatchMock.mockReturnValue(jest.fn());

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

  it('should redirect when there are limited product cards', async () => {
    const mockDispatch = jest.fn();
    useDispatchMock.mockReturnValue(action => action(mockDispatch));

    const props = {};

    await mountHookComponent(<ProductViewMissing {...props} />);
    expect(mockDispatch.mock.calls).toMatchSnapshot('redirect action');
  });
});
