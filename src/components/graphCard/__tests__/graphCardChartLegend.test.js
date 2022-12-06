import React from 'react';
import { Button } from '@patternfly/react-core';
import { GraphCardChartLegend } from '../graphCardChartLegend';
import { ChartIcon } from '../../chart/chartIcon';

describe('GraphCardChartLegend Component', () => {
  it('should render a basic component', async () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum_mock-product-id',
            data: [{ y: 0, hasData: true }]
          }
        ]
      },
      useProduct: () => ({ productLabel: 'mock-product-label' }),
      useSelectors: () => []
    };
    const component = await shallowHookComponent(<GraphCardChartLegend {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render basic data', async () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum_mock-product-id',
            metric: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'ametConsectetur_mock-product-id',
            metric: 'ametConsectetur',
            isThreshold: false,
            data: [{ y: 0, hasData: false }]
          },
          {
            stroke: '#ff0000',
            id: 'threshold_dolorSit_mock-product-id',
            metric: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          },
          {
            stroke: '#ff0000',
            id: 'threshold_nonCursus_mock-product-id',
            metric: 'nonCursus',
            isThreshold: true,
            data: [{ y: 0, isInfinite: true }]
          }
        ]
      },
      useProduct: () => ({ productId: 'mock-product-id', productLabel: 'mock-product-label' }),
      useSelectors: () => []
    };

    const component = await shallowHookComponent(<GraphCardChartLegend {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should handle a click event', async () => {
    const mockDispatch = jest.fn();
    const props = {
      chart: { toggle: id => `mock boolean, ${id}`, isToggled: () => false },
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum_mock-product-id',
            metric: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'threshold_dolorSit_mock-product-id',
            metric: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'mock-product-id', productLabel: 'mock-product-label', viewId: 'mock-view-id' }),
      useSelectors: () => [undefined, undefined, true]
    };

    const component = await shallowHookComponent(<GraphCardChartLegend {...props} />);
    component.find(Button).first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('click event, dispatch');
    mockDispatch.mockClear();

    component.find(Button).first().simulate('keyPress');
    expect(mockDispatch.mock.calls).toMatchSnapshot('keyPress event, dispatch');
    mockDispatch.mockClear();
  });

  it('should handle variations in data when returning legend items', async () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum_mock-product-id',
            metric: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'helloWorld_mock-product-id',
            metric: 'helloWorld',
            isThreshold: false,
            isToolbarFilter: true,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'sitAmet_mock-product-id',
            metric: 'sitAmet',
            isThreshold: false,
            isToolbarFilter: true,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'threshold_dolorSit_mock-product-id',
            metric: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      useDispatch: () => {},
      useProduct: () => ({ productId: 'mock-product-id', productLabel: 'mock-product-label', viewId: 'mock-view-id' }),
      useSelectors: () => [undefined, undefined, undefined, true, true]
    };

    const component = await mountHookComponent(<GraphCardChartLegend {...props} />);
    expect(component.find(ChartIcon).map(element => element.props())).toMatchSnapshot('legend items, data, threshold');
  });

  it('should handle inverted legend behavior when using an external filter', async () => {
    const mockHide = jest.fn();
    const props = {
      chart: {
        isToggled: jest.fn(),
        hide: mockHide
      },
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum_mock-product-id',
            metric: 'loremIpsum',
            isThreshold: false,
            isToolbarFilter: true,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'helloWorld_mock-product-id',
            metric: 'helloWorld',
            isThreshold: false,
            isToolbarFilter: true,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'sitAmet_mock-product-id',
            metric: 'sitAmet',
            isThreshold: false,
            isToolbarFilter: true,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'threshold_dolorSit_mock-product-id',
            metric: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      useDispatch: () => {},
      useProduct: () => ({ productId: 'mock-product-id', productLabel: 'mock-product-label', viewId: 'mock-view-id' }),
      useSelectors: () => ['helloWorld_mock-product-id']
    };

    await mountHookComponent(<GraphCardChartLegend {...props} />);
    expect(mockHide.mock.calls).toMatchSnapshot('attempt legend invert, hide items');
  });
});
