import React from 'react';
import { PageColumns } from '../pageColumns';

describe('PageColumns Component', () => {
  it('should render a basic component', async () => {
    const props = {
      className: 'lorem'
    };
    const component = await shallowComponent(
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
