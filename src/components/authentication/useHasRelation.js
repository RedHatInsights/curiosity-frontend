import { useState, useEffect } from 'react';
import { useAccessCheckContext } from '@project-kessel/react-kessel-access-check';
import { checkSelf } from '@project-kessel/react-kessel-access-check/core/api-client';
import { helpers } from '../../common';

/**
 * @memberof Authentication
 * @module useHasRelation
 */

const Relation = {
  INVENTORY_VIEW: 'subscriptions_report_view'
};

/**
 * Check if the current user has a given Kessel relation on the default workspace.
 * In dev mode always returns authorized unless REACT_APP_DEBUG_KESSEL_AUTHORIZED=false.
 *
 * @param {string} relation
 * @returns {{ has: boolean, isLoading: boolean }}
 */
const useHasRelation = relation => {
  const accessCheckContext = useAccessCheckContext();

  const [has, setHas] = useState(helpers.DEV_MODE ? process.env.REACT_APP_DEBUG_KESSEL_AUTHORIZED !== 'false' : false);
  const [isLoading, setIsLoading] = useState(!helpers.DEV_MODE);

  useEffect(() => {
    if (helpers.DEV_MODE) {
      return () => {};
    }
    let cancelled = false;
    (async () => {
      try {
        const result = await checkSelf(accessCheckContext, {
          relation,
          resource: {
            id: 'default',
            type: 'workspace',
            reporter: { type: 'rbac' }
          }
        });
        if (!cancelled) {
          setHas(result?.allowed === 'ALLOWED_TRUE');
          setIsLoading(false);
        }
      } catch {
        if (!cancelled) {
          setHas(false);
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // intentional: run once on mount, matches React Query one-shot behavior
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { has, isLoading };
};

export { useHasRelation as default, useHasRelation, Relation };
