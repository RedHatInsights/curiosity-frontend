import React from 'react';
import { mount } from 'enzyme';
import { PageToolbar } from '../pageToolbar';

describe('PageToolbar Component', () => {
  it('should render a basic component', () => {
    const props = {
      className: 'lorem'
    };
    const component = mount(
      <PageToolbar {...props}>
        <span className="test">lorem</span>
      </PageToolbar>
    );

    expect(component).toMatchSnapshot('basic');
  });
});
