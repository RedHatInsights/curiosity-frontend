import { useState, useEffect } from 'react';
import { useAccessCheckContext } from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { helpers } from '../../common';

/**
 * @memberof Authentication
 * @module useHasRelation
 */

const Relation = {
  INVENTORY_VIEW: 'subscriptions_report_view'
};

/**
 * Check if the current user has a given Kessel relation on their tenant.
 * In dev mode always returns authorized unless REACT_APP_DEBUG_KESSEL_AUTHORIZED=false.
 *
 * @param {string} relation
 * @param {object} [options]
 * @param {boolean} [options.enabled=true]
 * @returns {{ has: boolean, isLoading: boolean }}
 */
const useHasRelation = (relation, { enabled = true } = {}) => {
  const accessCheckContext = useAccessCheckContext();
  const chrome = useChrome();

  const [has, setHas] = useState(helpers.DEV_MODE ? process.env.REACT_APP_DEBUG_KESSEL_AUTHORIZED !== 'false' : false);
  const [isLoading, setIsLoading] = useState(!helpers.DEV_MODE && enabled);

  useEffect(() => {
    if (helpers.DEV_MODE || !enabled) {
      return () => {};
    }
    let cancelled = false;
    (async () => {
      try {
        const user = await chrome.auth.getUser();
        if (!user) {
          throw new Error('user does not exist');
        }
        const result = await checkSelf(accessCheckContext, {
          relation,
          resource: {
            id: `redhat/${user.identity.org_id}`,
            type: 'tenant',
            reporter: { type: 'rbac' }
          }
        });
        if (!cancelled) {
          setHas(result?.allowed === 'ALLOWED_TRUE');
          setIsLoading(false);
        }
      } catch (e) {
        console.error('useHasRelation checkSelf error:', e);
        if (!cancelled) {
          setHas(false);
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // re-run if Chrome feature flags arrive after first paint
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return { has, isLoading };
};

export { useHasRelation as default, useHasRelation, Relation };
