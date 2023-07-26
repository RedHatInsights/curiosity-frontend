import React from 'react';
import { SearchIcon } from '@patternfly/react-icons';
import { TableEmpty } from '../tableEmpty';

describe('TableEmpty Component', () => {
  it('should render a basic component', async () => {
    const props = {
      icon: SearchIcon,
      title: 'Lorem ipsum title',
      message: 'Lorem ipsum message.'
    };

    const component = await shallowComponent(<TableEmpty {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should have fallback checks for certain props', async () => {
    const props = {
      title: 'Lorem ipsum title',
      message: 'Lorem ipsum message.',
      tableHeading: 'h1'
    };

    const component = await shallowComponent(<TableEmpty {...props} />);
    expect(component).toMatchSnapshot('fallback display');
  });
});
