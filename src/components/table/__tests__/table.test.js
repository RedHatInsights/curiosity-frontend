import React from 'react';
import { TableVariant } from '@patternfly/react-table';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render a basic component', () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem', 'ipsum', 'dolor', 'sit']
    };

    const component = renderComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow variations in table layout', () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('table')).toMatchSnapshot('generated rows');

    const componentNoBordersHeader = component.setProps({
      borders: false,
      isHeader: false
    });
    expect(componentNoBordersHeader.find('table')).toMatchSnapshot('borders and table header removed');

    const componentAriaTableSummary = component.setProps({
      ariaLabel: 'lorem ipsum aria-label',
      summary: 'lorem ipsum summary'
    });
    expect(componentAriaTableSummary.find('table')).toMatchSnapshot('ariaLabel and summary');

    const componentClassVariant = component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(componentClassVariant.find('table')).toMatchSnapshot('className and variant');
  });

  it('should allow expandable row content', () => {
    const mockOnExpand = jest.fn();
    const props = {
      onExpand: mockOnExpand,
      rows: [
        { cells: ['dolor'], expandedContent: 'dolor sit expandable content', data: { hello: 'world' } },
        { cells: ['sit'] }
      ]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('expandable content');
    expect(component.find('tr.pf-c-table__expandable-row')).toMatchSnapshot('no expanded row');

    const input = component.find('td.pf-c-table__toggle button');
    component.fireEvent.click(input);

    expect(mockOnExpand.mock.calls).toMatchSnapshot('expand row event');
    expect(component.find('tr.pf-c-table__expandable-row')).toMatchSnapshot('expanded row');
  });

  it('should allow expandable cell content', () => {
    const mockOnExpand = jest.fn();
    const props = {
      onExpand: mockOnExpand,
      rows: [
        { cells: [{ content: 'dolor', expandedContent: 'dolor sit expandable content' }], data: { hello: 'world' } },
        { cells: ['sit'] }
      ]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('tr.pf-c-table__expandable-row')).toMatchSnapshot('no expanded cell');

    const input = component.find('button');
    component.fireEvent.click(input);

    expect(mockOnExpand.mock.calls).toMatchSnapshot('expand cell event');
    expect(component.find('tr.pf-c-table__expandable-row')).toMatchSnapshot('expanded cell');
  });

  it('should allow sortable content', () => {
    const mockSort = jest.fn();
    const props = {
      isHeader: true,
      onSort: mockSort,
      columnHeaders: [{ content: 'lorem ipsum', isSort: true }],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('table')).toMatchSnapshot('sortable content');

    const input = component.find('th button.pf-c-table__button');
    component.fireEvent.click(input);

    expect(mockSort).toHaveBeenCalledTimes(1);
  });

  it('should allow selectable row content', () => {
    const mockOnSelect = jest.fn();
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      onSelect: mockOnSelect,
      rows: [
        { cells: [{ content: 'dolor' }], dataLabel: 'testing' },
        { cells: ['sit'], dolorSit: 'hello world' }
      ]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('tbody tr')).toMatchSnapshot('select row content');

    const input = component.find('input[name="checkrow1"]');
    component.fireEvent.click(input, { currentTarget: {}, target: { checked: true }, checked: true });

    expect(mockOnSelect.mock.calls).toMatchSnapshot('select row input');
  });

  it('should pass child components, nodes when there are no rows', () => {
    const props = {
      isHeader: true,
      columnHeaders: ['lorem ipsum'],
      rows: []
    };

    const component = renderComponent(<Table {...props}>Loading...</Table>);
    expect(component).toMatchSnapshot('children');
  });
});
