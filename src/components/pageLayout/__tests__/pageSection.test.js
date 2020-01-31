import React from 'react';
import { mount } from 'enzyme';
import { PageSection } from '../pageSection';

describe('PageSection Component', () => {
  it('should render a basic component', () => {
    const props = {
      className: 'lorem'
    };
    const component = mount(
      <PageSection {...props}>
        <span className="test">lorem</span>
      </PageSection>
    );

    expect(component).toMatchSnapshot('basic');
  });
});
