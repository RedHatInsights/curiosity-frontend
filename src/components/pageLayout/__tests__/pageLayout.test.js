import React from 'react';
import { mount } from 'enzyme';
import { PageLayout, PageSection, PageHeader } from '../pageLayout';

describe('PageLayout Component', () => {
  it('should render a basic component', () => {
    const component = mount(
      <PageLayout>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render header and section children', () => {
    const component = mount(
      <PageLayout>
        <PageSection>ipsum</PageSection>
        <PageHeader>lorem</PageHeader>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('multiple children');
  });
});
