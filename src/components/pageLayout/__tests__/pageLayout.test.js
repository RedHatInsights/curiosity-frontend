import React from 'react';
import { PageLayout, PageSection, PageHeader } from '../pageLayout';

describe('PageLayout Component', () => {
  it('should render a basic component', async () => {
    const component = await shallowComponent(
      <PageLayout>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render header and section children', () => {
    const component = renderComponent(
      <PageLayout>
        <PageSection>ipsum</PageSection>
        <PageHeader>lorem</PageHeader>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('multiple children');
  });
});
