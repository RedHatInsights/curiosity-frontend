import React from 'react';
import PropTypes from 'prop-types';
import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark
} from '@patternfly/react-tokens';
import { Button, Label as PfLabel, Tooltip, TooltipPosition } from '@patternfly/react-core';
import InfoCircleIcon from '@patternfly/react-icons/dist/js/icons/info-circle-icon';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
import moment from 'moment';
import numbro from 'numbro';
import { PageLayout, PageColumns, PageHeader, PageSection, PageToolbar } from '../pageLayout/pageLayout';
import {
  RHSM_API_PATH_ID_TYPES,
  RHSM_API_QUERY_SORT_DIRECTION_TYPES as SORT_DIRECTION_TYPES,
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_TYPES,
  RHSM_API_QUERY_UOM_TYPES,
  RHSM_API_QUERY_SORT_TYPES,
  RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES
} from '../../types/rhsmApiTypes';
import { apiQueries, useSelector } from '../../redux';
import GraphCard from '../graphCard/graphCard';
import { ToolbarFieldUom } from '../toolbar/toolbarFieldUom';
import { ToolbarFieldGranularity } from '../toolbar/toolbarFieldGranularity';
import { ToolbarFieldRangedMonthly } from '../toolbar/toolbarFieldRangedMonthly';
import Toolbar from '../toolbar/toolbar';
import InventoryList from '../inventoryList/inventoryList';
import InventorySubscriptions from '../inventorySubscriptions/inventorySubscriptions';
import InventoryTabs, { InventoryTab } from '../inventoryTabs/inventoryTabs';
import { helpers, dateHelpers } from '../../common';
import { translate } from '../i18n/i18n';

/**
 * An OpenShift Container Platform encompassing view.
 *
 * @param {object} props
 * @param {Array} props.productConfig
 * @param {object} props.routeDetail
 * @param {Function} props.t
 * @returns {Node}
 */
const ProductViewOpenShiftContainer = ({ productConfig, routeDetail, t }) => {
  const uomValue = useSelector(({ view }) => view.query?.[productConfig[0].viewId]?.[RHSM_API_QUERY_TYPES.UOM], null);
  const { productParameter: viewProductLabel } = routeDetail;

  const renderProduct = (config, updatedUomValue) => {
    const {
      productContextFilterUom,
      query = {},
      graphTallyQuery = {},
      inventoryHostsQuery = {},
      inventorySubscriptionsQuery = {},
      initialGraphFilters = [],
      initialGraphSettings = {},
      initialGuestsFilters = [],
      initialInventoryFilters = [],
      initialInventorySettings = {},
      initialSubscriptionsInventoryFilters,
      initialToolbarFilters,
      productLabel,
      productId,
      viewId
    } = config;

    if (!productId || !viewId) {
      return null;
    }

    const {
      graphTallyQuery: initialGraphTallyQuery,
      inventoryHostsQuery: initialInventoryHostsQuery,
      inventorySubscriptionsQuery: initialInventorySubscriptionsQuery,
      toolbarQuery
    } = apiQueries.parseRhsmQuery(query, { graphTallyQuery, inventoryHostsQuery, inventorySubscriptionsQuery });

    let graphFilters = initialGraphFilters;
    let inventoryFilters = initialInventoryFilters;
    let subscriptionsInventoryFilters = initialSubscriptionsInventoryFilters;
    let uomFilter;

    if (productContextFilterUom) {
      uomFilter = updatedUomValue || query[RHSM_API_QUERY_TYPES.UOM];

      const filter = ({ id, isOptional }) => {
        if (!isOptional) {
          return true;
        }
        return new RegExp(uomFilter, 'i').test(id);
      };

      graphFilters = initialGraphFilters.filter(filter);
      inventoryFilters = initialInventoryFilters.filter(filter);
      subscriptionsInventoryFilters = initialSubscriptionsInventoryFilters.filter(filter);
    }

    const graphCardTitle = (
      <React.Fragment>
        {t('curiosity-graph.cardHeading', { context: productId })}
        <Tooltip
          content={<p>{t('curiosity-graph.cardHeadingDescription', { context: productId })}</p>}
          position={TooltipPosition.top}
          enableFlip={false}
          distance={5}
          entryDelay={100}
          exitDelay={0}
        >
          <sup className="curiosity-icon__info">
            <InfoCircleIcon />
          </sup>
        </Tooltip>
      </React.Fragment>
    );

    return (
      <React.Fragment key={`product_${productId}_${uomFilter}`}>
        {initialToolbarFilters && (
          <PageToolbar>
            <Toolbar filterOptions={initialToolbarFilters} productId={productId} query={toolbarQuery} viewId={viewId} />
          </PageToolbar>
        )}
        <PageSection>
          <GraphCard
            key={`graph_${productId}`}
            filterGraphData={graphFilters}
            settings={initialGraphSettings}
            query={initialGraphTallyQuery}
            productId={productId}
            viewId={viewId}
            cardTitle={graphCardTitle}
            productLabel={productLabel}
          >
            {productId === RHSM_API_PATH_ID_TYPES.OPENSHIFT && uomFilter && (
              <ToolbarFieldUom value={uomFilter} viewId={viewId} />
            )}
            {productId === RHSM_API_PATH_ID_TYPES.OPENSHIFT && (
              <ToolbarFieldGranularity value={graphTallyQuery[RHSM_API_QUERY_TYPES.GRANULARITY]} viewId={viewId} />
            )}
            {productId === RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS && <ToolbarFieldRangedMonthly viewId={viewId} />}
          </GraphCard>
        </PageSection>
        <PageSection>
          <InventoryTabs key={`inventory_${productId}`} productId={productId}>
            <InventoryTab
              key={`inventory_hosts_${productId}`}
              title={t('curiosity-inventory.tabHosts', { context: productId })}
            >
              <InventoryList
                key={`inv_${productId}`}
                filterGuestsData={initialGuestsFilters}
                filterInventoryData={inventoryFilters}
                productId={productId}
                settings={initialInventorySettings}
                query={initialInventoryHostsQuery}
                viewId={viewId}
              />
            </InventoryTab>
            {!helpers.UI_DISABLED_TABLE_SUBSCRIPTIONS && initialSubscriptionsInventoryFilters && (
              <InventoryTab
                key={`inventory_subs_${productId}`}
                title={t('curiosity-inventory.tabSubscriptions', { context: productId })}
              >
                <InventorySubscriptions
                  key={`subs_${productId}`}
                  filterInventoryData={subscriptionsInventoryFilters}
                  productId={productId}
                  query={initialInventorySubscriptionsQuery}
                  viewId={viewId}
                />
              </InventoryTab>
            )}
          </InventoryTabs>
        </PageSection>
      </React.Fragment>
    );
  };

  return (
    <PageLayout>
      <PageHeader productLabel={viewProductLabel} includeTour>
        {t(`curiosity-view.title`, { appName: helpers.UI_DISPLAY_NAME, context: viewProductLabel })}
      </PageHeader>
      <PageColumns>{productConfig.map(config => renderProduct(config, uomValue))}</PageColumns>
    </PageLayout>
  );
};

/**
 * Prop types.
 *
 * @type {{t: Function, routeDetail: object, productConfig: Array}}
 */
ProductViewOpenShiftContainer.propTypes = {
  productConfig: PropTypes.arrayOf(
    PropTypes.shape({
      productContextFilterUom: PropTypes.bool,
      query: PropTypes.shape({
        [RHSM_API_QUERY_TYPES.START_DATE]: PropTypes.string,
        [RHSM_API_QUERY_TYPES.END_DATE]: PropTypes.string
      }),
      graphTallyQuery: PropTypes.shape({
        [RHSM_API_QUERY_TYPES.GRANULARITY]: PropTypes.oneOf([...Object.values(GRANULARITY_TYPES)])
      }),
      inventoryHostsQuery: PropTypes.shape({
        [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
        [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
        [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SORT_TYPES)]),
        [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
      }),
      inventorySubscriptionsQuery: PropTypes.shape({
        [RHSM_API_QUERY_TYPES.LIMIT]: PropTypes.number,
        [RHSM_API_QUERY_TYPES.OFFSET]: PropTypes.number,
        [RHSM_API_QUERY_TYPES.SORT]: PropTypes.oneOf([...Object.values(RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES)]),
        [RHSM_API_QUERY_TYPES.DIRECTION]: PropTypes.oneOf([...Object.values(SORT_DIRECTION_TYPES)])
      }),
      initialOption: PropTypes.oneOf(Object.values(RHSM_API_QUERY_UOM_TYPES)),
      initialGraphFilters: PropTypes.array,
      initialGuestsFilters: PropTypes.array,
      initialInventoryFilters: PropTypes.array,
      initialInventorySettings: PropTypes.shape({
        hasGuests: PropTypes.func
      }),
      initialSubscriptionsInventoryFilters: PropTypes.array,
      initialToolbarFilters: PropTypes.array,
      productLabel: PropTypes.string,
      productId: PropTypes.string,
      viewId: PropTypes.string
    })
  ),
  routeDetail: PropTypes.shape({
    pathParameter: PropTypes.string,
    productParameter: PropTypes.string,
    viewParameter: PropTypes.string
  }).isRequired,
  t: PropTypes.func
};

/**
 * Default props.
 *
 * @type {{t: Function, productConfig: Array}}
 */
ProductViewOpenShiftContainer.defaultProps = {
  productConfig: [
    {
      productContextFilterUom: true,
      query: {
        [RHSM_API_QUERY_TYPES.UOM]: RHSM_API_QUERY_UOM_TYPES.CORES,
        [RHSM_API_QUERY_TYPES.START_DATE]: dateHelpers
          .getRangedDateTime(GRANULARITY_TYPES.DAILY)
          .startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: dateHelpers.getRangedDateTime(GRANULARITY_TYPES.DAILY).endDate.toISOString()
      },
      graphTallyQuery: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
      },
      inventoryHostsQuery: {
        [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SORT_TYPES.LAST_SEEN,
        [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
        [RHSM_API_QUERY_TYPES.LIMIT]: 100,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      inventorySubscriptionsQuery: {
        [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SUBSCRIPTIONS_SORT_TYPES.UPCOMING_EVENT_DATE,
        [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
        [RHSM_API_QUERY_TYPES.LIMIT]: 100,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      initialOption: RHSM_API_QUERY_UOM_TYPES.CORES,
      initialGraphFilters: [
        {
          id: 'cores',
          isOptional: true,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        },
        {
          id: 'sockets',
          isOptional: true,
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        },
        { id: 'thresholdSockets', chartType: 'threshold', isOptional: true },
        { id: 'thresholdCores', chartType: 'threshold', isOptional: true }
      ],
      initialGraphSettings: {},
      initialGuestsFilters: [
        {
          id: 'displayName',
          header: translate('curiosity-inventory.header', { context: 'guestsDisplayName' }),
          cell: (data, session) => {
            const { displayName, inventoryId } = data;
            const { inventory: authorized } = session?.authorized || {};

            if (!inventoryId?.value) {
              return displayName?.value;
            }

            if (!authorized) {
              return displayName?.value || inventoryId?.value;
            }

            return (
              <Button
                isInline
                component="a"
                variant="link"
                href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
              >
                {displayName.value || inventoryId.value}
              </Button>
            );
          }
        },
        {
          id: 'inventoryId',
          cellWidth: 40
        },
        {
          id: 'lastSeen',
          cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
          cellWidth: 15
        }
      ],
      initialInventoryFilters: [
        {
          id: 'displayName',
          cell: (data, session) => {
            const { displayName = {}, inventoryId = {}, numberOfGuests = {} } = data;
            const { inventory: authorized } = session?.authorized || {};

            if (!inventoryId.value) {
              return displayName.value;
            }

            let updatedDisplayName = displayName.value || inventoryId.value;

            if (authorized) {
              updatedDisplayName = (
                <Button
                  isInline
                  component="a"
                  variant="link"
                  href={`${helpers.UI_DEPLOY_PATH_PREFIX}/insights/inventory/${inventoryId.value}/`}
                >
                  {displayName.value || inventoryId.value}
                </Button>
              );
            }

            return (
              <React.Fragment>
                {updatedDisplayName}{' '}
                {(numberOfGuests.value &&
                  translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests.value }, [
                    <PfLabel color="blue" />
                  ])) ||
                  ''}
              </React.Fragment>
            );
          },
          isSortable: true
        },
        {
          id: 'sockets',
          header: translate('curiosity-inventory.header', { context: 'sockets_OpenShift Container Platform' }),
          isOptional: true,
          isSortable: true,
          isWrappable: true,
          cellWidth: 15
        },
        {
          id: 'cores',
          header: translate('curiosity-inventory.header', { context: 'cores_OpenShift Container Platform' }),
          isOptional: true,
          isSortable: true,
          isWrappable: true,
          cellWidth: 15
        },
        {
          id: 'lastSeen',
          cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
          isSortable: true,
          isWrappable: true,
          cellWidth: 25
        }
      ],
      initialInventorySettings: {},
      initialSubscriptionsInventoryFilters: [
        {
          id: 'productName',
          isSortable: true
        },
        {
          id: 'serviceLevel',
          isSortable: true,
          isWrappable: true,
          cellWidth: 15
        },
        {
          id: 'upcomingEventDate',
          cell: data =>
            (data?.upcomingEventDate?.value && moment.utc(data?.upcomingEventDate?.value).format('YYYY-DD-MM')) || '',
          isSortable: true,
          isWrappable: true,
          cellWidth: 15
        }
      ],
      initialToolbarFilters: [
        {
          id: RHSM_API_QUERY_TYPES.SLA
        }
      ],
      productLabel: 'OpenShift',
      productId: RHSM_API_PATH_ID_TYPES.OPENSHIFT,
      viewId: 'viewOpenShift'
    },
    {
      query: {
        [RHSM_API_QUERY_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
        [RHSM_API_QUERY_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
      },
      graphTallyQuery: {
        [RHSM_API_QUERY_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
      },
      inventoryHostsQuery: {
        [RHSM_API_QUERY_TYPES.SORT]: RHSM_API_QUERY_SORT_TYPES.LAST_SEEN,
        [RHSM_API_QUERY_TYPES.DIRECTION]: SORT_DIRECTION_TYPES.DESCENDING,
        [RHSM_API_QUERY_TYPES.LIMIT]: 100,
        [RHSM_API_QUERY_TYPES.OFFSET]: 0
      },
      initialGraphFilters: [
        {
          id: 'coreHours',
          fill: chartColorBlueLight.value,
          stroke: chartColorBlueDark.value,
          color: chartColorBlueDark.value
        }
      ],
      initialGraphSettings: {
        actionDisplay: data => {
          const {
            meta: { totalCoreHours }
          } = data;
          let displayContent;

          if (totalCoreHours) {
            displayContent = translate('curiosity-graph.card-action-total', {
              context: 'coreHours',
              total: numbro(totalCoreHours)
                .format({ average: true, mantissa: 2, trimMantissa: true, lowPrecision: false })
                .toUpperCase()
            });
          }

          return <div className="curiosity-usage-graph__total">{displayContent || null}</div>;
        }
      },
      initialInventoryFilters: [
        {
          id: 'displayName',
          cell: data => {
            const { displayName = {}, inventoryId = {}, numberOfGuests = {} } = data;

            if (!inventoryId.value) {
              return displayName.value;
            }

            const updatedDisplayName = displayName.value || inventoryId.value;

            return (
              <React.Fragment>
                {updatedDisplayName}{' '}
                {(numberOfGuests.value &&
                  translate('curiosity-inventory.label', { context: 'numberOfGuests', count: numberOfGuests.value }, [
                    <PfLabel color="blue" />
                  ])) ||
                  ''}
              </React.Fragment>
            );
          },
          isSortable: true
        },
        {
          id: 'coreHours',
          cell: data =>
            (typeof data?.coreHours?.value === 'number' && Number.parseFloat(data?.coreHours?.value).toFixed(2)) ||
            `0.00`,
          isSortable: true,
          isWrappable: true,
          cellWidth: 20
        },
        {
          id: 'lastSeen',
          cell: data => (data?.lastSeen?.value && <DateFormat date={data?.lastSeen?.value} />) || '',
          isSortable: true,
          isWrappable: true,
          cellWidth: 25
        }
      ],
      initialToolbarFilters: undefined,
      productLabel: 'OpenShift Metric',
      productId: RHSM_API_PATH_ID_TYPES.OPENSHIFT_METRICS,
      viewId: 'viewOpenShiftMetric'
    }
  ],
  t: translate
};

export { ProductViewOpenShiftContainer as default, ProductViewOpenShiftContainer };
