import React from 'react';
import { PageToolbar } from '../pageToolbar';

describe('PageToolbar Component', () => {
  it('should render a basic component', () => {
    const props = {
      className: 'lorem'
    };
    const component = renderComponent(
      <PageToolbar {...props}>
        <span className="test">lorem</span>
      </PageToolbar>
    );

    expect(component).toMatchSnapshot('basic');
  });
});
