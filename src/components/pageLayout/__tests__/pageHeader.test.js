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

  it('should render the subtitle when viewId is provided', () => {
    const component = mount(<PageHeader productLabel="RHEL">lorem</PageHeader>);
    expect(component).toMatchSnapshot('with subtitle');
  });

  it('should render the tour button when includeTour is provided', () => {
    const component = mount(<PageHeader includeTour>lorem</PageHeader>);
    expect(component).toMatchSnapshot('with tour button');
    expect(component.render()).toMatchSnapshot('consistent html output for Pendo CSS selector');
  });
});
