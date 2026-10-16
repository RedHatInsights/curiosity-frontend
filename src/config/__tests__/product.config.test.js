import { products } from '../products';
import { generateChartSettings } from '../../components/graphCard/graphCardHelpers';
import { inventoryCardHelpers } from '../../components/inventoryCard/inventoryCardHelpers';
import { ChartTypeVariant } from '../../components/chart/chartHelpers';
import {
  RHSM_API_PATH_METRIC_TYPES as METRIC_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES as PRODUCT_TYPES,
  RHSM_API_QUERY_CATEGORY_TYPES as CATEGORY_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_INVENTORY_SORT_DIRECTION_TYPES as SORT_DIRECTIONS,
  RHSM_API_QUERY_INVENTORY_SORT_TYPES as INVENTORY_SORT_TYPES,
  RHSM_API_QUERY_INVENTORY_SUBSCRIPTIONS_SORT_TYPES as SUBSCRIPTION_SORT_TYPES,
  RHSM_API_QUERY_SET_TYPES as QUERY_TYPES,
  RHSM_API_RESPONSE_META_TYPES as RESPONSE_META_TYPES,
  RHSM_API_RESPONSE_INSTANCES_DATA_TYPES as INSTANCE_FIELDS,
  RHSM_API_RESPONSE_SUBSCRIPTIONS_DATA_TYPES as SUBSCRIPTION_FIELDS,
  RHSM_INTERNAL_PRODUCT_DISPLAY_TYPES as PRODUCT_DISPLAY_TYPES
} from '../../services/rhsm/rhsmConstants';

const findProductConfig = productId => products.configs.find(config => config.productId === productId);
const findFilter = (filters, metric) => filters.find(filter => filter.metric === metric);

const getConfiguredGraphMetrics = graphFilters =>
  graphFilters
    .flatMap(({ filters, ...filter }) => (Array.isArray(filters) ? filters : [filter]))
    .map(({ metric }) => metric)
    .filter(Boolean);

const getGeneratedGraphMetrics = graphSettings =>
  graphSettings.flatMap(({ settings }) => settings.metrics.map(({ metric }) => metric));

const getInventoryMetrics = filters => filters.map(({ metric }) => metric);
const hasFilters = filters => Array.isArray(filters) && filters.length > 0;

const getInventoryFilterGroups = config =>
  [
    { filters: config.initialGuestsFilters, settings: config.initialGuestsSettings },
    { filters: config.initialInventoryFilters, settings: config.initialInventorySettings },
    { filters: config.initialSubscriptionsInventoryFilters, settings: config.initialSubscriptionsInventorySettings }
  ].filter(({ filters }) => Array.isArray(filters) && filters.length > 0);

const graphCallbackArgs = {
  dataSets: [
    {
      display: {
        chartId: 'example-chart',
        dailyDate: '2023-03-09T00:00:00.000Z',
        monthlyDate: '2022-03-09T00:00:00.000Z',
        dailyValue: 12.5,
        monthlyValue: 25,
        dailyHasData: true,
        monthlyHasData: true,
        remainingCapacity: 10.2,
        remainingCapacityHasData: true
      }
    }
  ]
};

const inventoryRow = {
  [INSTANCE_FIELDS.BILLING_ACCOUNT_ID]: 'billing-account-123',
  [INSTANCE_FIELDS.BILLING_PROVIDER]: 'aws',
  [INSTANCE_FIELDS.CATEGORY]: 'public_cloud',
  [INSTANCE_FIELDS.CLOUD_PROVIDER]: 'aws',
  [INSTANCE_FIELDS.DISPLAY_NAME]: 'example-host',
  [INSTANCE_FIELDS.INSTANCE_ID]: 'instance-123',
  [INSTANCE_FIELDS.INVENTORY_ID]: 'inventory-123',
  [INSTANCE_FIELDS.LAST_SEEN]: '2023-03-09T00:00:00.000Z',
  [INSTANCE_FIELDS.NUMBER_OF_GUESTS]: 2,
  [INSTANCE_FIELDS.SUBSCRIPTION_MANAGER_ID]: 'subscription-manager-123',
  [SUBSCRIPTION_FIELDS.HAS_INFINITE_QUANTITY]: true,
  [SUBSCRIPTION_FIELDS.NEXT_EVENT_DATE]: '2023-03-09T00:00:00.000Z',
  [SUBSCRIPTION_FIELDS.PRODUCT_NAME]: 'Example subscription',
  [SUBSCRIPTION_FIELDS.QUANTITY]: 2,
  [SUBSCRIPTION_FIELDS.SERVICE_LEVEL]: 'Premium',
  ...Object.fromEntries(Object.values(METRIC_TYPES).map(metric => [metric, 2]))
};

const getInventoryRow = filters =>
  filters.reduce(
    (row, { metric }, index) => ({
      ...row,
      [metric]: row[metric] ?? `inventory-value-${index}`
    }),
    inventoryRow
  );

const assertInventoryQueryDefaults = (query, sort) => {
  const { [QUERY_TYPES.METRIC_ID]: metricId, ...queryDefaults } = query || {};

  expect(queryDefaults).toEqual({
    [QUERY_TYPES.SORT]: sort,
    [QUERY_TYPES.DIRECTION]: SORT_DIRECTIONS.DESCENDING,
    [QUERY_TYPES.LIMIT]: 100,
    [QUERY_TYPES.OFFSET]: 0
  });
  expect([undefined, ...Object.values(METRIC_TYPES)]).toContain(metricId);
};

describe('Product specific configurations', () => {
  it('preserves configured metrics when generating graph settings', () => {
    const graphConfigs = products.configs.filter(({ initialGraphFilters }) => initialGraphFilters?.length);

    expect(graphConfigs).not.toHaveLength(0);

    graphConfigs.forEach(config => {
      const generatedSettings = generateChartSettings({
        filters: config.initialGraphFilters,
        settings: config.initialGraphSettings,
        productId: config.productId
      }).filtersSettings;

      expect(generatedSettings).not.toHaveLength(0);
      expect(getGeneratedGraphMetrics(generatedSettings)).toEqual(
        getConfiguredGraphMetrics(config.initialGraphFilters)
      );
      expect(generatedSettings.every(({ settings }) => settings.productId === config.productId)).toBe(true);
    });
  });

  it('uses shared graph and inventory query defaults across configured products', () => {
    products.configs.forEach(config => {
      expect(!hasFilters(config.initialGraphFilters) || Boolean(config.graphTallyQuery)).toBe(true);
      expect(!hasFilters(config.initialGuestsFilters) || Boolean(config.inventoryGuestsQuery)).toBe(true);
      expect(!hasFilters(config.initialInventoryFilters) || Boolean(config.inventoryHostsQuery)).toBe(true);
      expect(
        !hasFilters(config.initialSubscriptionsInventoryFilters) || Boolean(config.inventorySubscriptionsQuery)
      ).toBe(true);
    });

    const graphConfigs = products.configs.filter(({ graphTallyQuery }) => graphTallyQuery);
    expect(graphConfigs).not.toHaveLength(0);

    graphConfigs.forEach(({ graphTallyQuery }) => {
      expect(graphTallyQuery).toMatchObject({ [QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY });
      expect(
        Object.keys(graphTallyQuery).every(key =>
          [QUERY_TYPES.GRANULARITY, QUERY_TYPES.USE_RUNNING_TOTALS_FORMAT].includes(key)
        )
      ).toBe(true);
      expect([undefined, true]).toContain(graphTallyQuery[QUERY_TYPES.USE_RUNNING_TOTALS_FORMAT]);
    });
    expect(
      graphConfigs
        .filter(({ graphTallyQuery }) => graphTallyQuery[QUERY_TYPES.USE_RUNNING_TOTALS_FORMAT] === true)
        .map(({ productId }) => productId)
        .sort()
    ).toEqual([PRODUCT_TYPES.ANSIBLE, PRODUCT_TYPES.RHACM, PRODUCT_TYPES.ROSA].sort());

    const guestsConfigs = products.configs.filter(({ inventoryGuestsQuery }) => inventoryGuestsQuery);
    expect(guestsConfigs).not.toHaveLength(0);
    guestsConfigs.forEach(({ inventoryGuestsQuery }) => {
      expect(inventoryGuestsQuery).toEqual({
        [QUERY_TYPES.LIMIT]: 100,
        [QUERY_TYPES.OFFSET]: 0
      });
    });

    const hostConfigs = products.configs.filter(({ inventoryHostsQuery }) => inventoryHostsQuery);
    expect(hostConfigs).not.toHaveLength(0);
    hostConfigs.forEach(({ inventoryHostsQuery }) => {
      assertInventoryQueryDefaults(inventoryHostsQuery, INVENTORY_SORT_TYPES.LAST_SEEN);
    });
    expect(
      hostConfigs.map(({ inventoryHostsQuery }) => inventoryHostsQuery[QUERY_TYPES.METRIC_ID]).filter(Boolean)
    ).toEqual([METRIC_TYPES.SOCKETS]);

    const subscriptionConfigs = products.configs.filter(
      ({ inventorySubscriptionsQuery }) => inventorySubscriptionsQuery
    );
    expect(subscriptionConfigs).not.toHaveLength(0);
    subscriptionConfigs.forEach(({ inventorySubscriptionsQuery }) => {
      assertInventoryQueryDefaults(inventorySubscriptionsQuery, SUBSCRIPTION_SORT_TYPES.NEXT_EVENT_DATE);
    });
    expect(
      subscriptionConfigs
        .map(({ inventorySubscriptionsQuery }) => inventorySubscriptionsQuery[QUERY_TYPES.METRIC_ID])
        .filter(Boolean)
    ).toEqual([METRIC_TYPES.SOCKETS]);
  });

  it('evaluates shared graph card and axis callback contracts', () => {
    const graphConfigs = products.configs.filter(({ initialGraphFilters }) => initialGraphFilters?.length);
    const cardTranslationKeys = {
      header: 'curiosity-graph.cardHeadingMetric',
      body: 'curiosity-graph.cardBodyMetric',
      footer: 'curiosity-graph.cardFooterMetric'
    };
    const callbackResults = { cards: [], xAxisLabels: [], yAxisLabels: [], yAxisTicks: [] };

    graphConfigs.forEach(config => {
      const generatedSettings = generateChartSettings({
        filters: config.initialGraphFilters,
        settings: config.initialGraphSettings,
        productId: config.productId
      }).filtersSettings;

      generatedSettings.forEach(({ settings }) => {
        if (settings.isMetricDisplay && settings.cards?.length) {
          settings.cards.forEach(card => {
            Object.entries(cardTranslationKeys)
              .filter(([property]) => card[property] !== undefined)
              .forEach(([property, translationKey]) => {
                const callback = card[property];
                const result = typeof callback === 'function' ? callback(graphCallbackArgs) : callback;
                callbackResults.cards.push({ property, result, translationKey });
              });
          });
        }

        if (typeof settings.xAxisChartLabel === 'function') {
          callbackResults.xAxisLabels.push(settings.xAxisChartLabel());
        }

        if (typeof settings.yAxisChartLabel === 'function') {
          callbackResults.yAxisLabels.push(settings.yAxisChartLabel({ id: `${config.productId}-metric` }));
        }

        if (typeof settings.yAxisTickFormat === 'function') {
          [0.00001345, 0.0005, 0.05, 0.5, 1, 2, 1000, 1000000].forEach(tick => {
            callbackResults.yAxisTicks.push(settings.yAxisTickFormat({ tick }));
          });
        }
      });
    });

    expect(callbackResults.cards).not.toHaveLength(0);
    callbackResults.cards.forEach(({ result, translationKey }) =>
      expect(result).toEqual(expect.stringContaining(translationKey))
    );
    expect(callbackResults.xAxisLabels).not.toHaveLength(0);
    callbackResults.xAxisLabels.forEach(result =>
      expect(result).toEqual(expect.stringContaining('curiosity-graph.label_axisX'))
    );
    expect(callbackResults.yAxisLabels).not.toHaveLength(0);
    callbackResults.yAxisLabels.forEach(result =>
      expect(result).toEqual(expect.stringContaining('curiosity-graph.label_axisY'))
    );
    expect(callbackResults.yAxisTicks).not.toHaveLength(0);
    callbackResults.yAxisTicks.forEach(result => expect(result).toEqual(expect.stringMatching(/\d/)));
  });

  it('normalizes and parses configured inventory filters against API data', () => {
    const configsWithInventory = products.configs.filter(config => getInventoryFilterGroups(config).length > 0);

    expect(configsWithInventory).not.toHaveLength(0);

    configsWithInventory.forEach(config => {
      getInventoryFilterGroups(config).forEach(({ filters, settings }) => {
        const expectedMetrics = getInventoryMetrics(filters);
        const sortableFilter = filters.find(({ isSort }) => isSort === true);
        const row = getInventoryRow(filters);
        const normalized = inventoryCardHelpers.normalizeInventorySettings({
          filters,
          settings,
          productId: config.productId
        });

        expect(normalized.filters.map(({ metric }) => metric)).toEqual(expectedMetrics);
        expect(normalized.columnCountAndWidths.count).toBe(filters.length);
        normalized.filters.forEach(({ header, label, cell }) => {
          expect(header).toEqual(expect.any(Function));
          expect(label).toEqual(expect.any(Function));
          expect(cell).toEqual(expect.any(Function));
        });

        const parsed = inventoryCardHelpers.parseInventoryResponse({
          data: {
            data: [row, {}],
            meta: { [RESPONSE_META_TYPES.COUNT]: 2 }
          },
          filters: normalized.filters,
          query: {
            [QUERY_TYPES.LIMIT]: 25,
            [QUERY_TYPES.OFFSET]: 0,
            [QUERY_TYPES.SORT]: sortableFilter?.metric,
            [QUERY_TYPES.DIRECTION]: SORT_DIRECTIONS.DESCENDING
          },
          session: { authorized: { inventory: true } },
          settings: normalized.settings
        });

        expect(parsed.dataSetColumnHeaders.map(({ metric }) => metric)).toEqual(expectedMetrics);
        parsed.dataSetColumnHeaders.forEach(({ content }) => expect(content).not.toBeUndefined());

        expect(
          parsed.dataSetColumnHeaders
            .filter(({ isSortActive }) => isSortActive)
            .map(({ metric, sortDirection }) => ({ metric, sortDirection }))
        ).toEqual(sortableFilter ? [{ metric: sortableFilter.metric, sortDirection: SORT_DIRECTIONS.DESCENDING }] : []);

        expect(parsed.dataSetRows).toHaveLength(2);
        expect(parsed.dataSetRows.map(({ cells }) => cells.map(({ metric }) => metric))).toEqual([
          expectedMetrics,
          expectedMetrics
        ]);
        expect(parsed.dataSetRows[0].row).toEqual(row);

        const firstRowCells = parsed.dataSetRows[0].cells;
        firstRowCells.forEach(({ dataLabel }) => expect(dataLabel).not.toBeUndefined());

        const customCellMetrics = filters.filter(({ cell }) => cell).map(({ metric }) => metric);
        firstRowCells
          .filter(({ metric }) => customCellMetrics.includes(metric))
          .forEach(({ content }) => expect(content).not.toBeUndefined());
        firstRowCells
          .filter(({ metric }) => !customCellMetrics.includes(metric))
          .forEach(({ metric, content }) => expect(content).toBe(row[metric]));

        expect(parsed.resultsCount).toBe(2);
        expect(parsed.resultsOffset).toBe(0);
        expect(parsed.resultsPerPage).toBe(25);
      });
    });
  });

  describe('RHACM', () => {
    it('uses the capacity product and an ISO date range', () => {
      const config = findProductConfig(PRODUCT_TYPES.RHACM);

      expect(config).toBeDefined();
      expect(config).toMatchObject({
        productId: PRODUCT_TYPES.RHACM,
        productGroup: 'openshift',
        productDisplay: PRODUCT_DISPLAY_TYPES.CAPACITY
      });
      expect(config.onloadProduct).toContain(QUERY_TYPES.BILLING_ACCOUNT_ID);
      expect(config.graphTallyQuery).toEqual({
        [QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY,
        [QUERY_TYPES.USE_RUNNING_TOTALS_FORMAT]: true
      });
      expect(config.inventoryGuestsQuery).toEqual({
        [QUERY_TYPES.LIMIT]: 100,
        [QUERY_TYPES.OFFSET]: 0
      });
      expect(config.inventoryHostsQuery).toEqual({
        [QUERY_TYPES.SORT]: INVENTORY_SORT_TYPES.LAST_SEEN,
        [QUERY_TYPES.DIRECTION]: SORT_DIRECTIONS.DESCENDING,
        [QUERY_TYPES.LIMIT]: 100,
        [QUERY_TYPES.OFFSET]: 0
      });
      expect(config.inventorySubscriptionsQuery).toEqual({
        [QUERY_TYPES.SORT]: SUBSCRIPTION_SORT_TYPES.NEXT_EVENT_DATE,
        [QUERY_TYPES.DIRECTION]: SORT_DIRECTIONS.DESCENDING,
        [QUERY_TYPES.LIMIT]: 100,
        [QUERY_TYPES.OFFSET]: 0
      });

      const startDate = config.query[QUERY_TYPES.START_DATE];
      const endDate = config.query[QUERY_TYPES.END_DATE];
      expect(new Date(startDate).toISOString()).toBe(startDate);
      expect(new Date(endDate).toISOString()).toBe(endDate);
      expect(Date.parse(endDate)).toBeGreaterThan(Date.parse(startDate));
    });

    it('separates prepaid and on-demand vCPU usage and includes a capacity threshold', () => {
      const config = findProductConfig(PRODUCT_TYPES.RHACM);
      const expectedMetrics = [METRIC_TYPES.VCPUS, METRIC_TYPES.VCPUS_SELF_MANAGED];
      const generatedSettings = generateChartSettings({
        filters: config.initialGraphFilters,
        settings: config.initialGraphSettings,
        productId: config.productId
      }).filtersSettings;

      expect(generatedSettings).toHaveLength(expectedMetrics.length);

      generatedSettings.forEach(({ settings }, index) => {
        const metric = expectedMetrics[index];
        const { metrics } = settings;

        expect(metrics).toHaveLength(3);
        expect(metrics[0]).toMatchObject({
          metric,
          query: { [QUERY_TYPES.BILLING_CATEGORY]: CATEGORY_TYPES.PREPAID },
          isCapacity: false,
          isStacked: true
        });
        expect(metrics[1]).toMatchObject({
          metric,
          query: { [QUERY_TYPES.BILLING_CATEGORY]: CATEGORY_TYPES.ON_DEMAND },
          isCapacity: false,
          isStacked: true
        });
        expect(metrics[2]).toMatchObject({
          metric,
          isCapacity: true,
          isStacked: false,
          chartType: ChartTypeVariant.threshold
        });
      });
    });

    it('provides a remaining-capacity card and graph axis formatters', () => {
      const config = findProductConfig(PRODUCT_TYPES.RHACM);
      const { initialGraphFilters, initialGraphSettings, productId } = config;
      const [capacityCard] = initialGraphSettings.cards;
      const generatedSettings = generateChartSettings({
        filters: initialGraphFilters,
        settings: initialGraphSettings,
        productId
      }).filtersSettings;
      const header = capacityCard.header(graphCallbackArgs);
      const body = capacityCard.body(graphCallbackArgs);
      const footer = capacityCard.footer(graphCallbackArgs);
      const fractionalTick = initialGraphSettings.yAxisTickFormat({ tick: 0.5 });
      const wholeTick = initialGraphSettings.yAxisTickFormat({ tick: 2 });

      expect(initialGraphSettings.cards).toHaveLength(1);
      expect(generatedSettings).toHaveLength(2);
      generatedSettings.forEach(({ settings }) => expect(settings.cards).toHaveLength(1));
      expect(capacityCard.header).toEqual(expect.any(Function));
      expect(capacityCard.body).toEqual(expect.any(Function));
      expect(capacityCard.footer).toEqual(expect.any(Function));
      expect(initialGraphSettings.xAxisChartLabel).toEqual(expect.any(Function));
      expect(header).toEqual(expect.stringContaining('curiosity-graph.cardHeadingMetric_remainingCapacity'));
      expect(header).toEqual(expect.stringContaining('example-chart'));
      expect(body).toEqual(expect.stringContaining('curiosity-graph.cardBodyMetric_total'));
      expect(body).toEqual(expect.stringContaining('example-chart'));
      expect(body).toContain('"total":"10.2"');
      expect(footer).toEqual(expect.stringContaining('curiosity-graph.cardFooterMetric'));
      expect(footer).toEqual(expect.stringContaining('2023'));
      expect(footer).not.toEqual(expect.stringContaining('2022'));

      const xAxisLabel = initialGraphSettings.xAxisChartLabel();
      expect(xAxisLabel).toEqual(expect.stringContaining('curiosity-graph.label_axisX'));
      expect(xAxisLabel).toEqual(expect.stringContaining(GRANULARITY_TYPES.DAILY));

      expect(fractionalTick).toBe('0.5');
      expect(wholeTick).toBe('2');
    });

    it('defines the columns for guest, host, and subscription inventory', () => {
      const config = findProductConfig(PRODUCT_TYPES.RHACM);

      expect(getInventoryMetrics(config.initialGuestsFilters)).toEqual([
        INSTANCE_FIELDS.DISPLAY_NAME,
        INSTANCE_FIELDS.INVENTORY_ID,
        INSTANCE_FIELDS.LAST_SEEN
      ]);
      expect(getInventoryMetrics(config.initialInventoryFilters)).toEqual([
        INSTANCE_FIELDS.DISPLAY_NAME,
        INSTANCE_FIELDS.BILLING_PROVIDER,
        METRIC_TYPES.VCPUS,
        METRIC_TYPES.VCPUS_SELF_MANAGED,
        INSTANCE_FIELDS.LAST_SEEN
      ]);
      expect(getInventoryMetrics(config.initialSubscriptionsInventoryFilters)).toEqual([
        SUBSCRIPTION_FIELDS.PRODUCT_NAME,
        SUBSCRIPTION_FIELDS.BILLING_PROVIDER,
        SUBSCRIPTION_FIELDS.QUANTITY,
        SUBSCRIPTION_FIELDS.NEXT_EVENT_DATE
      ]);
    });

    it('expands hosts with guests and links authorized host names to instance details', () => {
      const config = findProductConfig(PRODUCT_TYPES.RHACM);
      const instanceId = 'rhacm-instance-123';
      const displayName = 'rhacm-cluster';
      const { guestContent } = config.initialInventorySettings;
      const guestDisplayNameFilter = findFilter(config.initialGuestsFilters, INSTANCE_FIELDS.DISPLAY_NAME);
      const displayNameFilter = findFilter(config.initialInventoryFilters, INSTANCE_FIELDS.DISPLAY_NAME);

      expect(
        guestContent({
          [INSTANCE_FIELDS.NUMBER_OF_GUESTS]: 3,
          [INSTANCE_FIELDS.INSTANCE_ID]: instanceId
        })
      ).toEqual({ id: instanceId, numberOfGuests: 3 });
      expect(
        guestContent({
          [INSTANCE_FIELDS.NUMBER_OF_GUESTS]: 0,
          [INSTANCE_FIELDS.INSTANCE_ID]: instanceId
        })
      ).toBeUndefined();
      expect(
        guestContent({
          [INSTANCE_FIELDS.NUMBER_OF_GUESTS]: 3
        })
      ).toBeUndefined();
      expect(
        guestDisplayNameFilter.cell(
          { [INSTANCE_FIELDS.INVENTORY_ID]: 'guest-inventory-123' },
          { authorized: { inventory: true } }
        )
      ).toBe('guest-inventory-123');

      const link = displayNameFilter.cell(
        {
          [INSTANCE_FIELDS.DISPLAY_NAME]: displayName,
          [INSTANCE_FIELDS.INSTANCE_ID]: instanceId
        },
        { authorized: { inventory: true } }
      );

      expect(link).toEqual(
        expect.objectContaining({
          props: expect.objectContaining({
            href: expect.stringContaining(`/openshift/details/${instanceId}/`),
            children: displayName
          })
        })
      );
      expect(
        displayNameFilter.cell(
          {
            [INSTANCE_FIELDS.DISPLAY_NAME]: displayName,
            [INSTANCE_FIELDS.INSTANCE_ID]: instanceId
          },
          { authorized: { inventory: false } }
        )
      ).toBe(displayName);

      const fallbackLink = displayNameFilter.cell(
        { [INSTANCE_FIELDS.INSTANCE_ID]: instanceId },
        { authorized: { inventory: true } }
      );
      expect(fallbackLink.props.children).toBe(instanceId);
    });

    it('formats representative host and subscription cells', () => {
      const config = findProductConfig(PRODUCT_TYPES.RHACM);
      const hostRow = {
        ...inventoryRow,
        [METRIC_TYPES.VCPUS]: 2,
        [METRIC_TYPES.VCPUS_SELF_MANAGED]: 8.5
      };
      const billingProviderFilter = findFilter(config.initialInventoryFilters, INSTANCE_FIELDS.BILLING_PROVIDER);
      const billingProviderCell = billingProviderFilter.cell(hostRow);
      const vcpusCell = findFilter(config.initialInventoryFilters, METRIC_TYPES.VCPUS).cell(hostRow);
      const selfManagedVcpusCell = findFilter(config.initialInventoryFilters, METRIC_TYPES.VCPUS_SELF_MANAGED).cell(
        hostRow
      );
      const lastSeen = inventoryRow[INSTANCE_FIELDS.LAST_SEEN];
      const lastSeenCell = findFilter(config.initialInventoryFilters, INSTANCE_FIELDS.LAST_SEEN).cell(hostRow);
      const subscriptionProviderCell = findFilter(
        config.initialSubscriptionsInventoryFilters,
        SUBSCRIPTION_FIELDS.BILLING_PROVIDER
      ).cell(hostRow);
      const nextEventDateCell = findFilter(
        config.initialSubscriptionsInventoryFilters,
        SUBSCRIPTION_FIELDS.NEXT_EVENT_DATE
      ).cell(hostRow);

      expect(billingProviderFilter.info.tooltip()).toEqual(expect.stringContaining('curiosity-inventory.tooltip'));
      expect(billingProviderCell.props.content).toEqual(expect.stringContaining('curiosity-inventory.tooltip'));
      expect(billingProviderCell.props.content).toEqual(expect.stringContaining('aws'));
      expect(billingProviderCell.props.content).toEqual(expect.stringContaining('billing-account-123'));
      expect(billingProviderCell.props.children).toEqual(expect.stringContaining('curiosity-inventory.label'));

      expect(vcpusCell).toEqual(expect.stringContaining('curiosity-inventory.measurement'));
      expect(vcpusCell).toEqual(expect.stringContaining('2.00'));
      expect(selfManagedVcpusCell).toEqual(expect.stringContaining('curiosity-inventory.measurement'));
      expect(selfManagedVcpusCell).toEqual(expect.stringContaining('8.50'));
      expect(lastSeenCell.props.date).toBe(lastSeen);

      expect(subscriptionProviderCell).toEqual(expect.stringContaining('curiosity-inventory.label'));
      expect(subscriptionProviderCell).toEqual(expect.stringContaining('aws'));
      expect(nextEventDateCell).toBe('2023-03-09');
    });
  });
});
