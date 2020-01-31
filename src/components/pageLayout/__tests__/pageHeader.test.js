import React from 'react';
import { mount } from 'enzyme';
import { PageHeader } from '../pageHeader';

describe('PageHeader Component', () => {
  it('should render a basic component', () => {
    const component = mount(
      <PageHeader>
        <span className="test">lorem</span>
      </PageHeader>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render string node types', () => {
    const component = mount(<PageHeader>dolor sit</PageHeader>);
    expect(component).toMatchSnapshot('string');
  });
});
