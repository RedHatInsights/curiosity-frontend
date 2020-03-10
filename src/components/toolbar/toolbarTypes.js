import { translate } from '../i18n/i18n';
import { RHSM_API_QUERY_SLA_TYPES as SLA_TYPES } from '../../types/rhsmApiTypes';

const getOptionsType = (optionsType = 'sla') => {
  if (optionsType === 'sla') {
    return {
      selected: null,
      options: [
        {
          title: translate('curiosity-toolbar.slaPremium'),
          value: SLA_TYPES.PREMIUM
        },
        {
          title: translate('curiosity-toolbar.slaStandard'),
          value: SLA_TYPES.STANDARD
        },
        {
          title: translate('curiosity-toolbar.slaSelfSupport'),
          value: SLA_TYPES.SELF
        },
        {
          title: translate('curiosity-toolbar.slaNone'),
          value: SLA_TYPES.NONE
        }
      ]
    };
  }

  return { options: [] };
};

const toolbarTypes = {
  getOptions: getOptionsType
};

export { toolbarTypes as default, toolbarTypes, getOptionsType };
