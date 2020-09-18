import React from 'react';
import { shallow } from 'enzyme';
import { TableVariant, SortByDirection } from '@patternfly/react-table';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render a non-connected component', () => {
    const props = {
      columnHeaders: ['lorem', 'ipsum', 'dolor', 'sit']
    };

    const component = shallow(<Table {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should allow variations in table layout', () => {
    const props = {
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = shallow(<Table {...props} />);
    expect(component).toMatchSnapshot('generated rows');

    component.setProps({
      borders: false,
      isHeader: false
    });
    expect(component).toMatchSnapshot('borders and table header removed');

    component.setProps({
      ariaLabel: 'lorem ipsum aria-label',
      summary: 'lorem ipsum summary'
    });
    expect(component).toMatchSnapshot('ariaLabel and summary');

    component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(component).toMatchSnapshot('className and variant');
  });

  it('should allow expandable content', () => {
    const props = {
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'], expandedContent: 'dolor sit expandable content' }, { cells: ['sit'] }]
    };

    const component = shallow(<Table {...props} />);
    expect(component).toMatchSnapshot('expandable content');

    const componentInstance = component.instance();
    componentInstance.onCollapse({ index: 0, isOpen: true });
    expect(component).toMatchSnapshot('expanded row');
  });

  it('should allow sortable content', () => {
    const props = {
      columnHeaders: [{ title: 'lorem ipsum', onSort: jest.fn() }],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = shallow(<Table {...props} />);
    expect(component).toMatchSnapshot('sortable content');

    const componentInstance = component.instance();
    componentInstance.onSort({ index: 0, direction: SortByDirection.asc });
    expect(component).toMatchSnapshot('sorted column callback');
    expect(props.columnHeaders[0].onSort).toHaveBeenCalledTimes(1);
  });

  it('should pass child components, nodes when there are no rows', () => {
    const props = {
      columnHeaders: ['lorem ipsum'],
      rows: []
    };

    const component = shallow(<Table {...props}>Loading...</Table>);
    expect(component).toMatchSnapshot('children');
  });
});
