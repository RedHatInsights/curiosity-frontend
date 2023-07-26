import React from 'react';
import { PageMessages } from '../pageMessages';

describe('PageMessages Component', () => {
  it('should render a basic component', () => {
    const props = {
      className: 'lorem'
    };
    const component = renderComponent(
      <PageMessages {...props}>
        <span className="test">lorem</span>
      </PageMessages>
    );

    expect(component).toMatchSnapshot('basic');
  });
});
