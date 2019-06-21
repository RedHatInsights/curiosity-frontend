import React from 'react';
import { mount } from 'enzyme';
import { PageLayout } from '../pageLayout';

describe('PageLayout Component', () => {
  it('should render a basic component', () => {
    const props = {};

    const component = mount(
      <PageLayout {...props}>
        <span className="test">lorem</span>
      </PageLayout>
    );

    expect(component).toMatchSnapshot('basic');
  });
});
