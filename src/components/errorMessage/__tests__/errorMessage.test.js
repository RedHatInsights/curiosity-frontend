import React from 'react';
import { ErrorMessage } from '../errorMessage';

describe('ErrorMessage Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<ErrorMessage {...props} />);
    expect(component).toMatchSnapshot('basic render');
  });

  it('should display custom messages', async () => {
    const props = {
      title: 'Lorem ipsum',
      description: 'Dolor sit'
    };

    const component = await shallowComponent(<ErrorMessage {...props} />);
    expect(component).toMatchSnapshot('messages');
  });

  it('should allow displaying an error cause', async () => {
    const mockGetDebugLog = jest.fn();
    const props = {
      message: new Error('Lorem ipsum dolor sit', { cause: ['Lorem ipsum', 'dolor sit'] }),
      getDebugLog: mockGetDebugLog
    };

    const component = renderComponent(<ErrorMessage {...props} />);
    // Find and click the cog/gear icon
    const input = component.find('button');
    component.fireEvent.click(input);

    // Find, focus and type the textarea
    const textarea = component.find('textarea');
    [68, 69, 40, 68, 69, 66, 85, 71].forEach(keyCode => component.fireEvent.keyUp(textarea, { keyCode }));

    // Click and attempt to download the debug log
    const link = component.find('button:nth-child(2)');
    component.fireEvent.click(link);

    expect(mockGetDebugLog).toHaveBeenCalledTimes(1);
    expect(component).toMatchSnapshot('error');
  });
});
