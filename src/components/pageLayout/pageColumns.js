import React from 'react';
import PropTypes from 'prop-types';
import { Flex, FlexItem } from '@patternfly/react-core';
import { helpers } from '../../common';

/**
 * Render page columns based on children.
 *
 * @param {object} props
 * @param {Node} props.children
 * @param {string} props.className
 * @returns {Node}
 */
const PageColumns = ({ children, className }) => (
  <Flex spaceItems={{ sm: 'spaceItemsNone' }} className={`curiosity-page-columns ${className}`}>
    {React.Children.toArray(children)
      .filter(child => React.isValidElement(child))
      .map(child => (
        <FlexItem
          key={(child.key && `page-column-${child.key}`) || helpers.generateId()}
          style={{ flexBasis: 0 }}
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
 * @type {{children: Node, className: string}}
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
