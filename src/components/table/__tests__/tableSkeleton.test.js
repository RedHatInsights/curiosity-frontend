import React from 'react';
import { TableVariant } from '@patternfly/react-table';
import { TableSkeleton } from '../tableSkeleton';

describe('TableSkeleton Component', () => {
  it('should render a non-connected component', async () => {
    const props = {};

    const component = await shallowComponent(<TableSkeleton {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should allow variations in table layout', async () => {
    const props = {
      colCount: 5,
      rowCount: 1
    };

    const component = await shallowComponent(<TableSkeleton {...props} />);
    expect(component).toMatchSnapshot('column and row count ');

    const componentColWidths = await component.setProps({
      colWidth: [null, undefined, 30, 15, 15]
    });
    expect(componentColWidths).toMatchSnapshot('table column widths');

    const componentRowRemoved = await component.setProps({
      borders: false,
      isHeader: false
    });
    expect(componentRowRemoved).toMatchSnapshot('borders and table header row removed');

    const componentClassNameVariant = await component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(componentClassNameVariant).toMatchSnapshot('className and variant');

    const componentNoHeaderNoRows = await component.setProps({
      rowCount: 0
    });
    expect(componentNoHeaderNoRows).toMatchSnapshot('no table header and zero rows');

    const componentHeaderNoRows = await component.setProps({
      isHeader: true,
      rowCount: 0
    });
    expect(componentHeaderNoRows).toMatchSnapshot('table header and zero rows');
  });
});
