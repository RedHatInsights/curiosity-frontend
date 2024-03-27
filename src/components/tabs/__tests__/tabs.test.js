import React from 'react';
import { Tabs } from '../tabs';

describe('Tabs Component', () => {
  it('should render a basic component', () => {
    const props = {
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { title: 'dolor', content: 'sit' }
      ]
    };

    const component = renderComponent(<Tabs {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow config activation of a tab', async () => {
    const props = {
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { active: true, title: 'dolor', content: 'sit' }
      ]
    };

    const component = await shallowComponent(<Tabs {...props} />);
    expect(component).toMatchSnapshot('config');
  });

  it('should allow specific activation of a tab', async () => {
    const props = {
      activeTab: 2,
      tabs: [
        { title: 'lorem', content: 'ipsum' },
        { active: true, title: 'dolor', content: 'sit' },
        { title: 'hello', content: 'world' }
      ]
    };

    const component = await shallowComponent(<Tabs {...props} />);
    expect(component).toMatchSnapshot('specific');
  });

  it('should handle no tabs', async () => {
    const props = {
      tabs: []
    };

    const component = await shallowComponent(<Tabs {...props} />);
    expect(component).toMatchSnapshot('no tabs');
  });
});
