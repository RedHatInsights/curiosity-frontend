import React from 'react';
import { shallow } from 'enzyme';
import { SearchIcon } from '@patternfly/react-icons';
import { TableEmpty } from '../tableEmpty';

describe('TableEmpty Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      icon: SearchIcon,
      title: 'Lorem ipsum title',
      message: 'Lorem ipsum message.'
    };

    const component = shallow(<TableEmpty {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have fallback checks for certain props', () => {
    const props = {
      title: 'Lorem ipsum title',
      message: 'Lorem ipsum message.',
      tableHeading: 'h1'
    };

    const component = shallow(<TableEmpty {...props} />);
    expect(component).toMatchSnapshot('fallback display');
  });
});
