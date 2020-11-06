import React from 'react';
import { shallow } from 'enzyme';
import { TableVariant } from '@patternfly/react-table';
import { TableSkeleton } from '../tableSkeleton';

describe('TableSkeleton Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<TableSkeleton {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should allow variations in table layout', () => {
    const props = {
      colCount: 5,
      rowCount: 1
    };

    const component = shallow(<TableSkeleton {...props} />);
    expect(component).toMatchSnapshot('column and row count ');

    component.setProps({
      colWidth: [null, undefined, 30, 15, 15]
    });
    expect(component).toMatchSnapshot('table column widths');

    component.setProps({
      borders: false,
      isHeader: false
    });
    expect(component).toMatchSnapshot('borders and table header row removed');

    component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(component).toMatchSnapshot('className and variant');

    component.setProps({
      rowCount: 0
    });
    expect(component).toMatchSnapshot('no table header and zero rows');

    component.setProps({
      isHeader: true
    });
    expect(component).toMatchSnapshot('table header and zero rows');
  });
});
