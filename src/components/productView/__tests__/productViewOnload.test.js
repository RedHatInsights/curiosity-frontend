import React from 'react';
import { ProductViewOnload } from '../productViewOnload';

describe('ProductViewOnload Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useProductOnload: () => ({ isReady: true })
    };
    const component = await shallowComponent(<ProductViewOnload {...props}>lorem ipsum</ProductViewOnload>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle display error responses', async () => {
    const props = {
      useProductOnload: () => ({ error: true, message: 'error message', productId: 'mockProductId' })
    };
    const component = await shallowComponent(<ProductViewOnload {...props}>lorem ipsum</ProductViewOnload>);
    expect(component).toMatchSnapshot('error');
  });

  it('should handle pending responses', async () => {
    const props = {
      useProductOnload: () => ({ isReady: false })
    };
    const component = await shallowComponent(<ProductViewOnload {...props}>lorem ipsum</ProductViewOnload>);
    expect(component).toMatchSnapshot('pending');
  });
});
