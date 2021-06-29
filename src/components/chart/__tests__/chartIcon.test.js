import React from 'react';
import { shallow } from 'enzyme';
import { ChartIcon } from '../chartIcon';

describe('ChartIcon Component', () => {
  it('should render a basic component', () => {
    const props = {};
    const component = shallow(<ChartIcon {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should handle basic icons, variations in settings', async () => {
    const iconProps = [
      {
        size: 'md',
        symbol: 'eye',
        title: 'lorem ipsum eye'
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

    iconProps.forEach(({ symbol, ...props }) => {
      const component = shallow(<ChartIcon symbol={symbol} {...props} />);
      expect(component).toMatchSnapshot(symbol);
    });
  });
});
