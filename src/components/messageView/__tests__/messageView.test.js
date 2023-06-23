import React from 'react';
import { BanIcon } from '@patternfly/react-icons';
import { MessageView } from '../messageView';

describe('MessageView Component', () => {
  it('should render a basic component', async () => {
    const props = {
      icon: BanIcon,
      message: 'ipsum',
      title: 'lorem'
    };

    const component = await shallowComponent(<MessageView {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have fallback conditions for all props', async () => {
    const props = {};

    const component = await shallowComponent(<MessageView {...props} />);
    expect(component).toMatchSnapshot('fallback display');
  });

  it('should render children when provided', async () => {
    const props = { children: 'child content' };

    const component = await shallowComponent(<MessageView {...props} />);
    expect(component).toMatchSnapshot('children display');
  });
});
