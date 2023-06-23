import React from 'react';
import { Loader } from '../loader';

describe('Loader Component', () => {
  it('should render a basic component', async () => {
    const props = {};

    const component = await shallowComponent(<Loader {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should handle variant loader components', async () => {
    const props = {};

    const component = await shallowComponent(<Loader {...props} />);
    expect(component).toMatchSnapshot('variant: default');

    const componentSkeleton = await component.setProps({
      variant: 'skeleton'
    });
    expect(componentSkeleton).toMatchSnapshot('variant: skeleton');

    const componentSpinner = await component.setProps({
      variant: 'spinner'
    });
    expect(componentSpinner).toMatchSnapshot('variant: spinner');

    const componentTitle = await component.setProps({
      variant: 'title'
    });
    expect(componentTitle).toMatchSnapshot('variant: title');

    const componentParagraph = await component.setProps({
      variant: 'paragraph'
    });
    expect(componentParagraph).toMatchSnapshot('variant: paragraph');

    const componentChart = await component.setProps({
      variant: 'chart'
    });
    expect(componentChart).toMatchSnapshot('variant: chart');

    const componentGraph = await component.setProps({
      variant: 'graph'
    });
    expect(componentGraph).toMatchSnapshot('variant: graph');

    const componentTable = await component.setProps({
      variant: 'table'
    });
    expect(componentTable).toMatchSnapshot('variant: table');
  });
});
