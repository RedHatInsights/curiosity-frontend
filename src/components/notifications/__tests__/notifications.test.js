import React from 'react';
import { Notifications } from '../notifications';

describe('Notifications Component', () => {
  it('should render a basic component', async () => {
    const props = {
      children: 'Lorem ipsum'
    };

    const component = await shallowComponent(<Notifications {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should render children directly when notifications are disabled', async () => {
    const props = {
      children: 'Lorem ipsum',
      isDisabled: true
    };

    const component = await shallowComponent(<Notifications {...props} />);
    expect(component).toMatchSnapshot('direct children');
  });
});
