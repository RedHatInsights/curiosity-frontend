import React from 'react';
import { shallow } from 'enzyme';
import { BanIcon } from '@patternfly/react-icons';
import { MessageView } from '../messageView';

describe('MessageView Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      icon: BanIcon,
      message: 'ipsum',
      title: 'lorem'
    };

    const component = shallow(<MessageView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should have fallback conditions for all props', () => {
    const props = {};

    const component = shallow(<MessageView {...props} />);
    expect(component).toMatchSnapshot('fallback display');
  });

  it('should render children when provided', () => {
    const props = { children: 'child content' };

    const component = shallow(<MessageView {...props} />);
    expect(component).toMatchSnapshot('children display');
  });
});
