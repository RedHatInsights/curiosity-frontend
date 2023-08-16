import React from 'react';
import ReactDom from 'react-dom';
import { ToolbarFilter, useToolbarContentContext, useToolbarContext } from '../toolbarFilter';

describe('ToolbarFilter Component', () => {
  it('should render a basic component', () => {
    const props = {
      categoryName: 'loremIpsum',
      chips: ['lorem', { key: 'ipsum', node: 'hello world' }]
    };
    const component = renderComponent(<ToolbarFilter {...props}>lorem ipsum</ToolbarFilter>);

    expect(component).toMatchSnapshot('basic');
  });

  it('should export specific context hooks', () => {
    expect({ useToolbarContentContext, useToolbarContext }).toMatchSnapshot('context hooks');
  });

  it('should display basic chips', () => {
    const mockPortal = jest.fn();
    const spyReactDom = jest.spyOn(ReactDom, 'createPortal').mockImplementation(mockPortal);

    const props = {
      categoryName: 'loremIpsum',
      chips: ['lorem', { key: 'ipsum', node: 'hello world' }],
      useToolbarContentContext: () => ({ chipContainerRef: { current: 'dolor sit test' } })
    };
    renderComponent(<ToolbarFilter {...props}>lorem ipsum</ToolbarFilter>);

    expect(mockPortal.mock.calls.pop()).toMatchSnapshot('portal');

    spyReactDom.mockClear();
  });
});
