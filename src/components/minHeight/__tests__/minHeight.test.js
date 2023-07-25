import React from 'react';
import { MinHeight } from '../minHeight';

describe('MinHeight Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await mountHookComponent(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component.html()).toMatchSnapshot('basic');
  });

  it('should allow override of minHeight', async () => {
    const props = {
      minHeight: 1001
    };
    const component = await mountHookComponent(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component.html()).toMatchSnapshot('override');
  });
});
