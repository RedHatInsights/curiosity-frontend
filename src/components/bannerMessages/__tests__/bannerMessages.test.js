import React from 'react';
import { shallow } from 'enzyme';
import { BannerMessages } from '../bannerMessages';

describe('BannerMessages Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      appMessages: {
        loremIpsum: true
      },
      messages: [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ]
    };
    const component = shallow(<BannerMessages {...props} />);

    expect(component).toMatchSnapshot('non-connected');
  });

  it('should render specific messages when the appMessages prop is used', () => {
    const props = {
      appMessages: {
        loremIpsum: false,
        dolorSit: false
      },
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
      ]
    };
    const component = shallow(<BannerMessages {...props} />);

    expect(component).toMatchSnapshot('specific messages, OFF');

    component.setProps({
      ...props,
      appMessages: {
        loremIpsum: true,
        dolorSit: false
      }
    });
    expect(component).toMatchSnapshot('specific messages, ON');
  });

  it('should handle closing messages from state', () => {
    const props = {
      appMessages: {
        loremIpsum: true
      },
      messages: [
        {
          id: 'loremIpsum',
          title: 'Lorem ipsum title',
          message: 'Lorem ipsum message'
        }
      ]
    };
    const component = shallow(<BannerMessages {...props} />);
    expect(component).toMatchSnapshot('state messages, ON');

    component.setState({ loremIpsum: true });
    expect(component).toMatchSnapshot('state messages, OFF');
  });
});
