import React from 'react';
import { chartAxisLabel } from '../chartAxisLabel';

describe('ChartAxisLabel Component', () => {
  it('should return a basic component', () => {
    const settings = {
      axis: 'y'
    };

    const props = {
      x: 2,
      y: 3,
      text: <React.Fragment>hello world</React.Fragment>
    };

    const Component = chartAxisLabel(settings);
    const updatedComponent = renderComponent(<Component {...props} />);

    expect(updatedComponent).toMatchSnapshot('basic');
  });

  it('should handle an undefined coordinate', () => {
    const settings = {
      axis: 'y',
      index: 1
    };

    const props = {
      x: 2,
      y: undefined,
      text: 'lorem ipsum'
    };

    const Component = chartAxisLabel(settings);
    const updatedComponent = renderComponent(<Component {...props} />);

    expect(updatedComponent).toMatchSnapshot('undefined y');
  });
});
