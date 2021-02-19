import React from 'react';
import { shallow } from 'enzyme';
import * as productContext from '../productContext';
import { RHSM_API_QUERY_TYPES, RHSM_API_QUERY_UOM_TYPES } from '../../../types/rhsmApiTypes';

describe('RouterContext', () => {
  // eslint-disable-next-line
  const Hook = ({ hook }) => <React.Fragment>{JSON.stringify(hook(), null, 2)}</React.Fragment>;
  const setContext = (context = {}) => jest.spyOn(React, 'useContext').mockImplementation(() => context);

  it('should return specific properties', () => {
    expect(productContext).toMatchSnapshot('specific properties');
  });

  it('should apply hooks for querying specific api endpoints', () => {
    const testContext = {
      productId: 'lorem',
      viewId: 'ipsum',
      query: { dolor: 'sit' },
      graphTallyQuery: { lorem: 'ipsum' },
      inventoryHostsQuery: { sit: 'amet' },
      inventorySubscriptionsQuery: { et: 'elementum' }
    };

    const generateHookResponse = ({ context, hook, message }) => {
      const spy = setContext(context);
      const component = shallow(<Hook hook={hook} />);
      expect(component).toMatchSnapshot(message);
      spy.mockClear();
    };

    generateHookResponse({ context: testContext, hook: productContext.useQueryContext, message: 'useQueryContext' });
    generateHookResponse({ context: testContext, hook: productContext.useQuery, message: 'useQuery' });
    generateHookResponse({
      context: testContext,
      hook: productContext.useGraphTallyQuery,
      message: 'useGraphTallyQuery'
    });
    generateHookResponse({
      context: testContext,
      hook: productContext.useInventoryHostsQuery,
      message: 'useInventoryHostsQuery'
    });
    generateHookResponse({
      context: testContext,
      hook: productContext.useInventorySubscriptionsQuery,
      message: 'useInventorySubscriptionsQuery'
    });
  });

  it('should apply a hook for useProductContext', () => {
    const testContext = {
      lorem: 'ipsum',
      productContextFilterUom: true,
      query: { [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES },
      initialGraphFilters: [
        { id: RHSM_API_QUERY_UOM_TYPES.CORES, isOptional: true, value: 'hello' },
        { id: RHSM_API_QUERY_UOM_TYPES.SOCKETS, isOptional: true, value: 'world' },
        { id: 'test id', value: 'test value' }
      ]
    };

    const generateHookResponse = ({ context, hook, message }) => {
      const spy = setContext(context);
      const component = shallow(<Hook hook={hook} />);
      expect(component).toMatchSnapshot(message);
      spy.mockClear();
    };

    generateHookResponse({
      context: testContext,
      hook: productContext.useProductContext,
      message: 'useProductContext'
    });
    generateHookResponse({
      context: testContext,
      hook: productContext.useProductContext,
      message: `useProductContext with uom filter, ${RHSM_API_QUERY_UOM_TYPES.CORES}`
    });
    generateHookResponse({
      context: { ...testContext, query: { [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.SOCKETS } },
      hook: productContext.useProductContext,
      message: `useProductContext with uom filter, ${RHSM_API_QUERY_UOM_TYPES.SOCKETS}`
    });
  });
});
