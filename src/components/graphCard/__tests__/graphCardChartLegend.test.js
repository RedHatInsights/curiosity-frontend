import React from 'react';
import { GraphCardChartLegend } from '../graphCardChartLegend';
import { helpers } from '../../../common';

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
    const component = await shallowComponent(<GraphCardChartLegend {...props} />);

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

    const component = await shallowComponent(<GraphCardChartLegend {...props} />);
    expect(component).toMatchSnapshot('data');
  });

  it('should handle a click event', () => {
    const mockDispatch = jest.fn();
    const props = {
      chart: {
        hide: id => `mock hide boolean, ${id}`,
        toggle: id => `mock toggle boolean, ${id}`,
        isToggled: () => false
      },
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

    const component = renderComponent(<GraphCardChartLegend {...props} />);
    const firstButton = component.find('.curiosity-graph__legend-item');
    component.fireEvent.click(firstButton, {});
    expect(mockDispatch.mock.calls).toMatchSnapshot('click event, dispatch');

    const mockEvent = { keyCode: 13, which: 13, key: 'Enter', persist: helpers.noop };
    component.fireEvent.keyPress(firstButton, mockEvent);
    expect(mockDispatch.mock.calls).toMatchSnapshot('keyPress event, dispatch');
  });

  it('should handle variations in data when returning legend items', () => {
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
      useSelectors: () => [undefined, undefined, undefined, true, false]
    };

    const component = renderComponent(<GraphCardChartLegend {...props} />);
    expect([...component.querySelectorAll('.curiosity-chartarea__icon')].map(elem => elem.className)).toMatchSnapshot(
      'legend items, data, threshold'
    );
  });

  it('should handle inverted legend behavior when using an external filter', () => {
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

    renderComponent(<GraphCardChartLegend {...props} />);
    expect(mockHide.mock.calls).toMatchSnapshot('attempt legend invert, hide items');
  });
});
