import React from 'react';
import PropTypes from 'prop-types';
import { Flex, FlexItem } from '@patternfly/react-core';
import { helpers } from '../../common';

/**
 * @memberof PageLayout
 * @module PageColumns
 */

/**
 * Render page columns based on children.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className
 * @returns {React.ReactNode}
 */
const PageColumns = ({ children, className }) => (
  <Flex
    alignItems={{ sm: 'alignItemsStretch' }}
    spaceItems={{ sm: 'spaceItemsNone' }}
    className={`curiosity-page-columns ${className}`}
  >
    {React.Children.toArray(children)
      .filter(child => React.isValidElement(child))
      .map(child => (
        <FlexItem
          key={(child.key && `page-column-${child.key}`) || helpers.generateId()}
          grow={{ sm: 'grow' }}
          className="curiosity-page-columns-column"
        >
          {child}
        </FlexItem>
      ))}
  </Flex>
);

/**
 * Prop types.
 *
 * @type {{children: React.ReactNode, className: string}}
 */
PageColumns.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

/**
 * Default props.
 *
 * @type {{className: string}}
 */
PageColumns.defaultProps = {
  className: ''
};

export { PageColumns as default, PageColumns };
