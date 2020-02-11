import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_GRANULARITY_TYPES as GRANULARITY_TYPES } from '../../types/rhsmApiTypes';

const getGranularityOptionsType = optionsType => {
  if (optionsType === 'default') {
    return {
      selected: GRANULARITY_TYPES.DAILY,
      options: [
        { title: translate('curiosity-graph.dropdownDaily'), value: GRANULARITY_TYPES.DAILY, selected: true },
        { title: translate('curiosity-graph.dropdownWeekly'), value: GRANULARITY_TYPES.WEEKLY },
        { title: translate('curiosity-graph.dropdownMonthly'), value: GRANULARITY_TYPES.MONTHLY },
        { title: translate('curiosity-graph.dropdownQuarterly'), value: GRANULARITY_TYPES.QUARTERLY }
      ]
    };
  }

  return { options: [] };
};

const graphCardTypes = {
  getGranularityOptions: getGranularityOptionsType
};

export { graphCardTypes as default, graphCardTypes, getGranularityOptionsType };
