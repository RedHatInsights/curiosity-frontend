import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';

const getDateMenuOptionsType = () => [
  { title: translate('curiosity-graph.dropdownDaily', 'Daily'), value: GRANULARITY_TYPES.DAILY },
  { title: translate('curiosity-graph.dropdownWeekly', 'Weekly'), value: GRANULARITY_TYPES.WEEKLY },
  { title: translate('curiosity-graph.dropdownMonthly', 'Monthly'), value: GRANULARITY_TYPES.MONTHLY },
  { title: translate('curiosity-graph.dropdownQuarterly', 'Quarterly'), value: GRANULARITY_TYPES.QUARTERLY }
];

const rhelGraphCardTypes = {
  getDateMenuOptions: getDateMenuOptionsType
};

export { rhelGraphCardTypes as default, rhelGraphCardTypes, getDateMenuOptionsType };
