import React from 'react';
import { PageThemeSwitcher } from '../pageThemeSwitcher';

describe('PageThemeSwitcher Component', () => {
  it('should render a basic component', async () => {
    const props = {
      className: 'lorem'
    };
    const component = await shallowComponent(<PageThemeSwitcher {...props} />);

    expect(component).toMatchSnapshot('basic');
  });
});
