import React from 'react';
import { Tooltip } from '../tooltip';

describe('Tooltip Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = renderComponent(<Tooltip {...props}>hello world</Tooltip>);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow custom properties', async () => {
    const props = {
      content: <span>tooltip content</span>,
      isNoWrap: true
    };

    const component = await shallowComponent(
      <Tooltip {...props}>
        <div>content</div>
      </Tooltip>
    );
    expect(component).toMatchSnapshot('custom, content');
  });
});
