import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip } from '../tooltip';

describe('Tooltip Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = shallow(<Tooltip {...props}>hello world</Tooltip>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow custom properties', () => {
    const props = {
      content: <span>tooltip content</span>,
      isNoWrap: true
    };

    const component = shallow(
      <Tooltip {...props}>
        <div>content</div>
      </Tooltip>
    );
    expect(component).toMatchSnapshot('custom, content');
  });
});
