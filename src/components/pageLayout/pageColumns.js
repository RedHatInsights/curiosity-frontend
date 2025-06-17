import React from 'react';
import { Flex, FlexItem } from '@patternfly/react-core';
import { helpers } from '../../common';

/**
 * @memberof PageLayout
 * @module PageColumns
 */

/**
 * Render page columns based on children.
 *
 * @deprecated
 * @param {object} props
 * @param {React.ReactNode} [props.children=[]]
 * @param {string} [props.className='']
 * @returns {JSX.Element}
 */
const PageColumns = ({ children = [], className = '' }) => (
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

export { PageColumns as default, PageColumns };
