import _differenceBy from 'lodash/differenceBy';

/**
 * @memberof Rhsm
 * @module RhsmHelpers
 */

/**
 * Apply generic stats to a minimally "sorted by service type" object.
 *
 * Attempt to avoid business specific logic by looping and using each "service type" as a diff base
 * to pull unique providers and account ids.
 *
 * @param {{ instances: Array<{id:string, provider:string, type:string}>|undefined,
 *     subscriptions: Array<{id:string, provider:string, type:string}>|undefined }} [baseMetrics={}]
 * @returns {{
 *   instances: {hasUniqueAccounts:boolean, hasUniqueProviders:boolean, accounts:Array, providers:Array,
 *   firstProvider:string, firstProviderAccount:object, firstProviderNumberAccounts:number,
 *   numberProviders:number}|undefined, subscriptions: {hasUniqueAccounts:boolean, hasUniqueProviders:boolean,
 *   accounts:Array, providers:Array, firstProvider:string, firstProviderAccount:object,
 *   firstProviderNumberAccounts:number, numberProviders:number}|undefined
 * }}
 */
const billingMetrics = (baseMetrics = {}) => {
  const serviceTypeProviderAccountIdMetrics = {};
  const baseMetricsValues = Object.values(baseMetrics);

  baseMetricsValues.forEach((typeArr, index) => {
    const newTemp = baseMetricsValues.toSpliced(index, 1);
    const serviceType = typeArr[0].type;

    const uniqueAccounts = _differenceBy(typeArr, ...newTemp, 'id');
    const uniqueProviders = _differenceBy(typeArr, ...newTemp, 'provider');
    const aggregatedAccountsProviders = [...uniqueAccounts, ...uniqueProviders];

    const filterAggregatedAccountsProviders = {};

    aggregatedAccountsProviders.forEach(({ id, provider }) => {
      filterAggregatedAccountsProviders[provider] ??= new Set();
      filterAggregatedAccountsProviders[provider].add(id);
    });

    const numberProviders = Object.keys(filterAggregatedAccountsProviders).length;
    const [firstProvider, firstProviderAccounts = []] =
      Object?.entries(filterAggregatedAccountsProviders)?.shift() || [];
    const firstProviderNumberAccounts = firstProviderAccounts.size;
    const firstProviderAccount = Array.from(firstProviderAccounts)[0];

    serviceTypeProviderAccountIdMetrics[serviceType] = {
      hasUniqueAccounts: uniqueAccounts.length > 0,
      hasUniqueProviders: uniqueProviders.length > 0,
      accounts: uniqueAccounts,
      providers: uniqueProviders,
      firstProvider,
      firstProviderAccount,
      firstProviderNumberAccounts,
      numberProviders
    };
  });

  return serviceTypeProviderAccountIdMetrics;
};

const rhsmHelpers = {
  billingMetrics
};

export { rhsmHelpers as default, rhsmHelpers, billingMetrics };
