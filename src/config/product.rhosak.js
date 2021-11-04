import {
  chart_color_blue_100 as chartColorBlueLight,
  chart_color_blue_300 as chartColorBlueDark,
  chart_color_cyan_100 as chartColorCyanLight,
  chart_color_cyan_300 as chartColorCyanDark,
  chart_color_purple_100 as chartColorPurpleLight,
  chart_color_purple_300 as chartColorPurpleDark
} from '@patternfly/react-tokens';
import {
  RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES,
  RHSM_API_QUERY_SET_TYPES,
  RHSM_API_PATH_PRODUCT_TYPES,
  RHSM_API_PATH_METRIC_TYPES
} from '../services/rhsm/rhsmConstants';
import { translate } from '../components/i18n/i18n';
import { dateHelpers } from '../common';

/**
 * ToDo: evaluate separating products/product tags into individual configs...
 * or using anArray/List then generating "routes.js"
 */

const productGroup = RHSM_API_PATH_PRODUCT_TYPES.RHOSAK;

const productId = RHSM_API_PATH_PRODUCT_TYPES.RHOSAK;

const productLabel = RHSM_API_PATH_PRODUCT_TYPES.RHOSAK;

const config = {
  productGroup,
  productId,
  productLabel,
  viewId: `view${productGroup}`,
  query: {
    [RHSM_API_QUERY_SET_TYPES.START_DATE]: dateHelpers.getRangedMonthDateTime('current').value.startDate.toISOString(),
    [RHSM_API_QUERY_SET_TYPES.END_DATE]: dateHelpers.getRangedMonthDateTime('current').value.endDate.toISOString()
  },
  graphTallyQuery: {
    [RHSM_API_QUERY_SET_TYPES.GRANULARITY]: GRANULARITY_TYPES.DAILY
  },
  inventoryHostsQuery: {},
  inventorySubscriptionsQuery: {},
  initialGraphFilters: [
    {
      id: RHSM_API_PATH_METRIC_TYPES.TRANSFER_GIBIBYTES,
      fill: chartColorBlueLight.value,
      stroke: chartColorBlueDark.value,
      color: chartColorBlueDark.value,
      chartType: 'line',
      isStacked: false,
      isStandalone: true,
      yAxisChartLabel: ({ id }) => translate('curiosity-graph.label_axisY', { context: id })
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.STORAGE_GIBIBYTES,
      fill: chartColorPurpleLight.value,
      stroke: chartColorPurpleDark.value,
      color: chartColorPurpleDark.value,
      chartType: 'line',
      isStacked: false,
      isStandalone: true,
      yAxisChartLabel: ({ id }) => translate('curiosity-graph.label_axisY', { context: id })
    },
    {
      id: RHSM_API_PATH_METRIC_TYPES.INSTANCE_HOURS,
      fill: chartColorCyanLight.value,
      stroke: chartColorCyanDark.value,
      color: chartColorCyanDark.value,
      chartType: 'line',
      isStacked: false,
      isStandalone: true,
      yAxisChartLabel: ({ id }) => translate('curiosity-graph.label_axisY', { context: id })
    }
  ],
  initialGraphSettings: {
    isCardTitleDescription: true,
    xAxisChartLabel: () => translate('curiosity-graph.label_axisX', { context: GRANULARITY_TYPES.DAILY })
  },
  initialToolbarFilters: [
    {
      id: 'rangedMonthly'
    }
  ]
};

export { config as default, config, productGroup, productId };
