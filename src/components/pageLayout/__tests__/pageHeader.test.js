import React from 'react';
import { PageHeader } from '../pageHeader';

describe('PageHeader Component', () => {
  it('should render a basic component', async () => {
    const component = await shallowComponent(
      <PageHeader>
        <span className="test">lorem</span>
      </PageHeader>
    );

    expect(component).toMatchSnapshot('basic');
  });

  it('should render string node types', () => {
    const component = renderComponent(<PageHeader>dolor sit</PageHeader>);
    expect(component).toMatchSnapshot('string');
  });

  it('should render the subtitle when viewId is provided', () => {
    const component = renderComponent(<PageHeader productLabel="RHEL">lorem</PageHeader>);
    expect(component).toMatchSnapshot('with subtitle');
  });
});
