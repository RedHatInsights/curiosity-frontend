import React from 'react';
import { MinHeight } from '../minHeight';

describe('MinHeight Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow override of minHeight', () => {
    const props = {
      minHeight: 1001
    };
    const component = renderComponent(<MinHeight {...props}>lorem ipsum</MinHeight>);
    expect(component).toMatchSnapshot('override');
  });
});
