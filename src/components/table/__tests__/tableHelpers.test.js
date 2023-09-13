import React from 'react';
import { tableHelpers, parseContent, tableHeader, tableRows } from '../tableHelpers';

describe('TableHelpers', () => {
  it('should have specific functions', () => {
    expect(tableHelpers).toMatchSnapshot('tableHelpers');
  });

  it('parseContent should return a consistent output from multiple types', () => {
    expect({
      func: parseContent(() => 'lorem ipsum'),
      node: parseContent(<React.Fragment>dolor sit</React.Fragment>),
      null: parseContent(null),
      obj: parseContent({ hello: 'world' }),
      undefined: parseContent(undefined)
    }).toMatchSnapshot('multiple types');
  });

  it('tableHeader should return parsed table header settings, props', () => {
    expect({
      basic: tableHeader(),
      isAllSelected: tableHeader({ isAllSelected: true }),
      columnHeaders: tableHeader({
        columnHeaders: [
          'lorem',
          { content: 'dolor' },
          () => 'hello world',
          <React.Fragment>hello world</React.Fragment>
        ]
      }),
      onSelect: tableHeader({
        onSelect: () => {},
        columnHeaders: ['lorem', { content: 'dolor' }, () => 'hello world']
      }),
      onSort: tableHeader({
        onSort: () => {},
        columnHeaders: ['lorem', { content: 'dolor', isSort: true }, () => 'hello world']
      }),
      isRowExpand: tableHeader({
        onSort: () => {},
        isRowExpand: true,
        columnHeaders: ['lorem', { content: 'dolor', isSort: true }, () => 'hello world']
      })
    }).toMatchSnapshot('tableHeader');
  });

  it('tableRows should return parsed table body settings, props', () => {
    expect({
      basic: tableRows(),
      rows: tableRows({
        rows: [
          { cells: ['lorem'] },
          { cells: [{ content: 'dolor' }] },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      }),
      styling: tableRows({
        rows: [
          { cells: [{ content: 'lorem', width: '9px' }] },
          { cells: [{ content: 'dolor', style: { backgroundColor: 'red' }, width: '50em' }] },
          { cells: [{ content: () => 'hello world', width: 1 }] },
          { cells: [{ content: <React.Fragment>hello world</React.Fragment>, width: 11 }] }
        ]
      }),
      onExpandCells: tableRows({
        onExpand: () => {},
        rows: [
          { cells: ['lorem'] },
          { cells: [{ content: 'dolor', expandedContent: 'sit', isExpanded: true }] },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      }),
      onExpandRows: tableRows({
        onExpand: () => {},
        rows: [
          { cells: ['lorem'], expandedContent: 'ipsum', isExpanded: true },
          { cells: [{ content: 'dolor' }] },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      }),
      onSelect: tableRows({
        onSelect: () => {},
        rows: [
          { cells: ['lorem'], isSelected: true },
          { cells: [{ content: 'dolor' }], isDisabled: true },
          { cells: [() => 'hello world'] },
          { cells: [<React.Fragment>hello world</React.Fragment>] }
        ]
      })
    }).toMatchSnapshot('tableRows');
  });
});
