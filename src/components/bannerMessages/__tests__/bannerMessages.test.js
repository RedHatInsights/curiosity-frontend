import React from 'react';
import { AlertActionCloseButton } from '@patternfly/react-core';
import { BannerMessages } from '../bannerMessages';

describe('BannerMessages Component', () => {
  it('should render a non-connected component', async () => {
    const props = {
      messages: [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ],
      useAppMessages: () => ({ appMessages: { loremIpsum: true } }),
      useRouteDetail: () => ({})
    };

    const component = await mountHookComponent(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should attempt to check reports on product update', async () => {
    const props = {
      messages: [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ],
      useAppMessages: jest.fn(() => ({})),
      useRouteDetail: () => ({ productConfig: [{ productId: 'lorem' }] })
    };

    const component = await shallowHookComponent(<BannerMessages {...props} />);
    component.setProps({ useRouteDetail: () => ({ productConfig: [{ productId: 'dolor' }] }) });
    expect(props.useAppMessages).toHaveBeenCalledTimes(2);
  });

  it('should render specific messages when the appMessages prop is used', async () => {
    const props = {
      messages: [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        },
        {
          id: 'dolorSit',
          title: 'Dolor sit title',
          message: 'Dolor sit message'
        }
      ],
      useAppMessages: () => ({ appMessages: { loremIpsum: false, dolorSit: true } }),
      useRouteDetail: () => ({})
    };

    const component = await mountHookComponent(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('specific messages, OFF, ON');
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
      useAppMessages: () => ({ appMessages: { dolorSit: true } }),
      useRouteDetail: () => ({})
    };

    const component = await mountHookComponent(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('state messages, ON');

    component.find(AlertActionCloseButton).first().simulate('click');

    expect(component.render()).toMatchSnapshot('state messages, OFF');
  });
});
