import React from 'react';
import { mount } from 'enzyme';
import { PageColumns } from '../pageColumns';

describe('PageColumns Component', () => {
  it('should render a basic component', () => {
    const props = {
      className: 'lorem'
    };
    const component = mount(
      <PageColumns {...props}>
        <span className="dolor">lorem</span>
        <span key="hello-world" className="sit">
          ipsum
        </span>
      </PageColumns>
    );

    expect(component).toMatchSnapshot('basic');
  });
});
