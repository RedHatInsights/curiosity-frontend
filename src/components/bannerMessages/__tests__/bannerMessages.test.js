import React from 'react';
import { BannerMessages } from '../bannerMessages';

describe('BannerMessages Component', () => {
  it('should render a basic component', async () => {
    const props = {
      useBannerMessages: () => [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ],
      useRemoveBannerMessages: Function.prototype
    };

    const component = await shallowComponent(<BannerMessages {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle closing messages from state', () => {
    const mockRemove = jest.fn();
    const props = {
      useBannerMessages: () => [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ],
      useRemoveBannerMessages: () => mockRemove
    };

    const component = renderComponent(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('state messages, ON');

    const input = component.find('button');
    component.fireEvent.click(input);
    expect(mockRemove.mock.calls).toMatchSnapshot('state messages, OFF id');
  });
});
