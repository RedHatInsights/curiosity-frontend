import React from 'react';
import { Provider } from 'react-redux';
import { ProductViewMissing } from '../productViewMissing';
import { store } from '../../../redux';

describe('ProductViewMissing Component', () => {
  it('should render a basic component', () => {
    const props = {
      availableProductsRedirect: 1
    };

    const component = renderComponent(
      <Provider store={store}>
        <ProductViewMissing {...props} />
      </Provider>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should redirect when there are limited product cards', async () => {
    const mockPush = jest.fn();
    const props = {
      availableProductsRedirect: 200,
      useNavigate: () => mockPush,
      useRouteDetail: () => ({ firstMatch: { productPath: 'lorem-ipsum' } })
    };

    await shallowComponent(<ProductViewMissing {...props} />);
    expect(mockPush.mock.calls).toMatchSnapshot('redirect action');
  });
});
