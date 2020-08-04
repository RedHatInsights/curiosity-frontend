import { translate } from '../i18n/i18n';
import {
  RHSM_API_QUERY_SLA,
  RHSM_API_QUERY_SLA_TYPES as SLA_TYPES,
  RHSM_API_QUERY_USAGE,
  RHSM_API_QUERY_USAGE_TYPES as USAGE_TYPES
} from '../../types/rhsmApiTypes';

/**
 * Get filter options to display by type.
 *
 * @param {string} optionsType
 * @returns {object}
 */
const getOptionsType = optionsType => {
  switch (optionsType) {
    case RHSM_API_QUERY_SLA:
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
    case RHSM_API_QUERY_USAGE:
      return {
        selected: null,
        options: [
          {
            title: translate('curiosity-toolbar.usageDevelopment'),
            value: USAGE_TYPES.DEVELOPMENT
          },
          {
            title: translate('curiosity-toolbar.usageDisaster'),
            value: USAGE_TYPES.DISASTER
          },
          {
            title: translate('curiosity-toolbar.usageProduction'),
            value: USAGE_TYPES.PRODUCTION
          },
          {
            title: translate('curiosity-toolbar.usageUnspecified'),
            value: USAGE_TYPES.UNSPECIFIED
          }
        ]
      };
    default:
      return {
        selected: null,
        options: [
          {
            title: translate('curiosity-toolbar.slaCategory'),
            value: RHSM_API_QUERY_SLA
          },
          {
            title: translate('curiosity-toolbar.usageCategory'),
            value: RHSM_API_QUERY_USAGE
          }
        ]
      };
  }
};

const toolbarTypes = {
  getOptions: getOptionsType
};

export { toolbarTypes as default, toolbarTypes, getOptionsType };
