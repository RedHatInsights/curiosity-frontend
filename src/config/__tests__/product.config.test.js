import { products } from '../products';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import {
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INVENTORY_TYPES,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTIONS_INVENTORY_TYPES
} from '../../services/rhsm/rhsmConstants';
import { inventoryCardHelpers } from '../../components/inventoryCard/inventoryCardHelpers';

describe('Product specific configurations', () => {
  /**
   * Return value, or execute if function
   *
   * @param {Function|*} value
   * @param {*} args
   * @returns {*}
   */
  const propFuncOrValue = (value, ...args) => (typeof value === 'function' && value(...args)) || value;

  /**
   * Run y-axis tick formatter through multiple display formats.
   *
   * @param {Function} yAxisTickFormat
   * @returns {*}
   */
  const yAxisGraphTicks = yAxisTickFormat => {
    const yTicks = {};

    for (let i = 0.00001345; i < 1; i++) {
      for (let k = 1; k < 26; k++) {
        const incrementMultiplier = k * i;
        yTicks[incrementMultiplier] = yAxisTickFormat({ tick: incrementMultiplier });
      }
    }

    for (let i = 0.001; i < 1; i++) {
      for (let k = 1; k < 26; k++) {
        const incrementMultiplier = k * i;
        yTicks[incrementMultiplier] = yAxisTickFormat({ tick: incrementMultiplier });
      }
    }

    for (let i = 0; i < 13; i++) {
      const multiplier = Math.pow(10, i);
      for (let k = 1; k < 16; k++) {
        const incrementMultiplier = k * multiplier;
        yTicks[incrementMultiplier] = yAxisTickFormat({ tick: incrementMultiplier });
      }
    }

    return yTicks;
  };

  /**
   * Parse product graph filters, settings
   *
   * @returns {{availableAxes: any[], availableProducts: any[], availableGraphCards: any[]}}
   */
  const setGraphFiltersSettings = () => {
    const availableProducts = [];
    const availableGraphCards = [];
    const availableAxes = [];

    products.configs
      .filter(({ initialGraphFilters: filters }) => !!filters?.length)
      .forEach(({ productId, initialGraphFilters, initialGraphSettings }) => {
        const generated = generateChartSettings({
          filters: initialGraphFilters,
          settings: initialGraphSettings,
          productId
        });

        availableProducts.push({
          [productId]: generated
        });

        const productGraphCardsAxes = {};
        const productGraphCards = {};

        generated?.filtersSettings.forEach(({ settings }) => {
          const { isMetricDisplay, cards } = settings;

          if (isMetricDisplay && cards.length) {
            const individualCards = [];
            cards.forEach(({ header, body, footer }) => {
              individualCards.push({
                header: propFuncOrValue(header),
                body: propFuncOrValue(body),
                footer: propFuncOrValue(footer, {
                  dataSets: [
                    {
                      display: {
                        dailyDate: '09 Mar 2023',
                        monthlyDate: '09 Mar 2023'
                      }
                    }
                  ]
                })
              });
            });

            productGraphCards[productId] = individualCards;
          }

          const { xAxisLabelIncrement, xAxisChartLabel, yAxisChartLabel, xAxisTickFormat, yAxisTickFormat } = settings;

          if (xAxisLabelIncrement) {
            productGraphCardsAxes[productId] ??= {};
            productGraphCardsAxes[productId].xAxisLabelIncrement = xAxisLabelIncrement;
          }

          if (xAxisChartLabel) {
            productGraphCardsAxes[productId] ??= {};
            productGraphCardsAxes[productId].xAxisChartLabel = propFuncOrValue(xAxisChartLabel);
          }

          if (yAxisChartLabel) {
            productGraphCardsAxes[productId] ??= {};
            productGraphCardsAxes[productId].yAxisChartLabel = propFuncOrValue(yAxisChartLabel);
          }

          if (xAxisTickFormat) {
            productGraphCardsAxes[productId] ??= {};
            productGraphCardsAxes[productId].xAxisTickFormatAvailable = true;
          }

          if (yAxisTickFormat) {
            productGraphCardsAxes[productId] ??= {};
            productGraphCardsAxes[productId].yAxisTickFormatAvailable = true;
            productGraphCardsAxes[productId].yAxisTickFormat = yAxisGraphTicks(yAxisTickFormat);
          }
        });

        if (Object.keys(productGraphCards).length) {
          availableGraphCards.push(productGraphCards);
        }

        if (Object.keys(productGraphCardsAxes).length) {
          availableAxes.push(productGraphCardsAxes);
        }
      });

    return {
      availableAxes,
      availableGraphCards,
      availableProducts
    };
  };

  /**
   * Parse product inventory filters, settings. This includes instances, instance guests, and subscriptions.
   *
   * @param {object} data
   * @param {object} options
   * @param {Array} options.filters
   * @param {string} options.productId
   * @param {object} options.query
   * @param {object} options.session
   * @returns {object}
   */
  const setInventoryFiltersSettings = (data, { filters, productId, query = {}, session = {} } = {}) => {
    const { data: listData = [], meta } = data;
    let dataSetColumnHeaders;

    const dataSetRows = listData.map(({ ...cellData }) => {
      const { columnHeaders, cells } = inventoryCardHelpers.parseRowCellsListData({
        filters: inventoryCardHelpers.parseInventoryFilters({
          filters,
          query
        }),
        cellData,
        meta,
        session,
        productId
      });

      dataSetColumnHeaders = columnHeaders;
      return cells;
    });

    return {
      [productId]: {
        dataSetColumnHeaders,
        dataSetRows
      }
    };
  };

  it('should apply query parameters', () => {
    expect(
      products.configs.map(
        ({ productId, graphTallyQuery, inventoryGuestsQuery, inventoryHostsQuery, inventorySubscriptionsQuery }) => ({
          [productId]: {
            graphTallyQuery,
            inventoryGuestsQuery,
            inventoryHostsQuery,
            inventorySubscriptionsQuery
          }
        })
      )
    ).toMatchSnapshot('product query parameters');
  });

  it('should apply graph filters and settings', () => {
    const { availableProducts, availableGraphCards, availableAxes } = setGraphFiltersSettings();

    expect(availableProducts).toMatchSnapshot('graph filters, settings');
    expect(availableGraphCards).toMatchSnapshot('graph cards');
    expect(availableAxes).toMatchSnapshot('graph axes');
  });

  it('should apply variations in inventory filters and settings', () => {
    const guests = {
      filterLabel: 'guests',
      filterProp: 'initialGuestsFilters',
      inventoryData: {
        data: [
          {
            [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
            [INVENTORY_TYPES.INVENTORY_ID]: 'lorem inventory id',
            [INVENTORY_TYPES.SUBSCRIPTION_MANAGER_ID]: 'XXXX-XXXX-XXXXX-XXXXX',
            [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z',
            loremIpsum: 'hello world'
          }
        ]
      }
    };

    const inventory = {
      filterLabel: 'inventory',
      filterProp: 'initialInventoryFilters',
      inventoryData: {
        data: [
          {
            [INVENTORY_TYPES.DISPLAY_NAME]: 'lorem',
            [INVENTORY_TYPES.CLOUD_PROVIDER]: 'dolor sit',
            [INVENTORY_TYPES.INSTANCE_ID]: 'XXXX-XXXX-XXXXX-XXXXX',
            [INVENTORY_TYPES.LAST_SEEN]: '2022-01-01T00:00:00.000Z',
            loremIpsum: 'hello world'
          }
        ]
      }
    };

    const subscriptions = {
      filterLabel: 'subscriptions',
      filterProp: 'initialSubscriptionsInventoryFilters',
      inventoryData: {
        data: [
          {
            [SUBSCRIPTIONS_INVENTORY_TYPES.PRODUCT_NAME]: 'lorem',
            [SUBSCRIPTIONS_INVENTORY_TYPES.BILLING_PROVIDER]: 'dolor sit',
            [SUBSCRIPTIONS_INVENTORY_TYPES.HAS_INFINITE_QUANTITY]: true,
            [SUBSCRIPTIONS_INVENTORY_TYPES.NEXT_EVENT_DATE]: '2022-01-01T00:00:00.000Z',
            [SUBSCRIPTIONS_INVENTORY_TYPES.QUANTITY]: 1,
            [SUBSCRIPTIONS_INVENTORY_TYPES.SERVICE_LEVEL]: 'hello world',
            [SUBSCRIPTIONS_INVENTORY_TYPES.TOTAL_CAPACITY]: 2000,
            [SUBSCRIPTIONS_INVENTORY_TYPES.UOM]: 'cores',
            loremIpsum: 'hello world'
          }
        ]
      }
    };

    [guests, inventory, subscriptions].forEach(({ filterLabel, filterProp, inventoryData }) => {
      const availableProducts = products.configs.filter(({ [filterProp]: filters }) => !!filters?.length);

      expect(availableProducts.map(({ productId }) => productId)).toMatchSnapshot(
        `${filterLabel} filters, available product configs`
      );

      expect(
        availableProducts.map(({ productId, [filterProp]: filters }) => ({
          ...setInventoryFiltersSettings(inventoryData, { filters, productId })
        }))
      ).toMatchSnapshot(`${filterLabel} filters, settings`);

      const session = { authorized: { inventory: true } };

      expect(
        availableProducts.map(({ productId, [filterProp]: filters }) => ({
          ...setInventoryFiltersSettings(inventoryData, { filters, productId, session })
        }))
      ).toMatchSnapshot(`${filterLabel} authorized filters, settings`);
    });
  });
});
