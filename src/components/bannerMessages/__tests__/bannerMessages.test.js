import React from 'react';
import { AlertActionCloseButton } from '@patternfly/react-core';
import { BannerMessages } from '../bannerMessages';

describe('BannerMessages Component', () => {
  it('should render a basic component', async () => {
    const props = {
      messages: [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ],
      useGetAppMessages: () => ({
        data: {
          loremIpsum: true
        }
      })
    };
    const component = await mountHookComponent(<BannerMessages {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle closing messages from state', async () => {
    const props = {
      messages: [
        {
          id: 'dolorSit',
          title: 'Dolor sit title',
          message: 'Dolor sit message'
        }
      ],
      useGetAppMessages: () => ({ data: { dolorSit: true } })
    };

    const component = await mountHookComponent(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('state messages, ON');

    component.find(AlertActionCloseButton).first().simulate('click');

    expect(component.render()).toMatchSnapshot('state messages, OFF');
  });
});
