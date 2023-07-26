import React from 'react';
import { ChartIcon } from '../chartIcon';

describe('ChartIcon Component', () => {
  it('should render a basic component', async () => {
    const props = {};
    const component = await shallowComponent(<ChartIcon {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle basic icons, variations in settings', () => {
    const iconProps = [
      {
        size: 'md',
        symbol: 'eye',
        title: 'lorem ipsum eye',
        'aria-label': 'hello world'
      },
      {
        size: 'md',
        symbol: 'eyeSlash',
        title: 'lorem ipsum eyeSlash'
      },
      {
        size: 'md',
        symbol: 'infinity',
        title: 'lorem ipsum infinity'
      },
      {
        size: 'lg',
        symbol: 'dash',
        title: 'lorem ipsum dash'
      },
      {
        size: 'xl',
        symbol: 'threshold',
        title: null,
        fill: '#ff0000'
      }
    ];

    iconProps.forEach(async ({ symbol, ...props }) => {
      const component = renderComponent(<ChartIcon symbol={symbol} {...props} />);
      expect(component.find('span')).toMatchSnapshot(symbol);
    });
  });
});
