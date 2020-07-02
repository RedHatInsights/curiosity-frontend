import React from 'react';
import PropTypes from 'prop-types';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/cjs/Skeleton';
import { Spinner } from '@redhat-cloud-services/frontend-components/components/cjs/Spinner';
import { PageHeader, PageLayout } from '../pageLayout/pageLayout';

/**
 * ToDo: Expand the loader to accept variants.
 * Need updated skeleton with multiline/paragraph, graph and table variations.
 */
/**
 * Render a basic skeleton loader.
 *
 * @param {string} variant
 * @returns {Node}
 */
const Loader = ({ variant }) => {
  switch (variant) {
    case 'title':
      return (
        <PageLayout>
          <PageHeader>
            <Skeleton size="md" />
          </PageHeader>
        </PageLayout>
      );
    case 'skeleton':
      return <Skeleton size="md" />;
    case 'spinner':
    default:
      return <Spinner />;
  }
};

/**
 * Prop types.
 *
 * @type {{}}
 */
Loader.propTypes = {
  variant: PropTypes.oneOf(['skeleton', 'spinner', 'title'])
};

/**
 * Default props.
 *
 * @type {{}}
 */
Loader.defaultProps = {
  variant: 'skeleton'
};

export { Loader as default, Loader };
