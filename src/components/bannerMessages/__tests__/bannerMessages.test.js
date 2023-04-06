import React from 'react';
import { AlertActionCloseButton } from '@patternfly/react-core';
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
      ]
    };
    const component = await mountHookComponent(<BannerMessages {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle closing messages from state', async () => {
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

    const component = await mountHookComponent(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('state messages, ON');

    component.find(AlertActionCloseButton).first().simulate('click');

    expect(mockRemove.mock.calls).toMatchSnapshot('state messages, OFF id');
  });
});
