import React from 'react';
import { Button } from '@patternfly/react-core';
import { GraphCardChartLegend } from '../graphCardChartLegend';

describe('GraphCardChartLegend Component', () => {
  it('should render a basic component', async () => {
    const props = {
      datum: {
        dataSets: [
          {
            stroke: '#000000',
            id: 'loremIpsum',
            data: [{ y: 0, hasData: true }]
          }
        ]
      },
      useProduct: () => ({ productLabel: 'dolorSit' }),
      useSelector: callback => callback({})
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
            id: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#000000',
            id: 'ametConsectetur',
            isThreshold: false,
            data: [{ y: 0, hasData: false }]
          },
          {
            stroke: '#ff0000',
            id: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          },
          {
            stroke: '#ff0000',
            id: 'nonCursus',
            isThreshold: true,
            data: [{ y: 0, isInfinite: true }]
          }
        ]
      },
      useProduct: () => ({ productId: 'test id', productLabel: 'test' }),
      useSelector: callback => callback({})
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
            id: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      useDispatch: () => mockDispatch,
      useProduct: () => ({ productId: 'test id', productLabel: 'test', viewId: 'test' }),
      useSelector: callback => callback({ legend: { 'test-dolorSit': true } })
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
            id: 'loremIpsum',
            isThreshold: false,
            data: [{ y: 0, hasData: true }]
          },
          {
            stroke: '#ff0000',
            id: 'dolorSit',
            isThreshold: true,
            data: [{ y: 0, isInfinite: false }]
          }
        ]
      },
      useDispatch: () => {},
      useProduct: () => ({ productId: 'test id', productLabel: 'test', viewId: 'test' }),
      useSelector: callback => callback({ legend: { 'test-dolorSit': true, 'test-loremIpsum': false } })
    };

    const component = await shallowHookComponent(<GraphCardChartLegend {...props} />);
    expect(component).toMatchSnapshot('legend items, data, threshold');
  });
});
