import React from 'react';
import { shallow } from 'enzyme';
import { OptinView } from '../optinView';

describe('OptinView Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<OptinView {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });
});
