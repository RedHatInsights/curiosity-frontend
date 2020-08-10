import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import { TableVariant } from '@patternfly/react-table';
import { Card, CardActions, CardBody, CardFooter, CardHeader, CardTitle, Title } from '@patternfly/react-core';
import { helpers } from '../../common';
import { connect, reduxActions, reduxSelectors } from '../../redux';
import Table from '../table/table';
import { Loader } from '../loader/loader';
import { inventoryListHelpers } from './inventoryListHelpers';
import Pagination from '../pagination/pagination';
import { rhsmApiTypes } from '../../types';

class InventoryList extends React.Component {
  componentDidMount() {
    this.onUpdateInventoryData();
  }

  componentDidUpdate(prevProps) {
    const { productId, query } = this.props;

    if (productId !== prevProps.productId || !_isEqual(query, prevProps.query)) {
      this.onUpdateInventoryData();
    }
  }

  onUpdateInventoryData = () => {
    const { getHostsInventory, isDisabled, productId, query } = this.props;

    if (!isDisabled && productId) {
      getHostsInventory(productId, query);
    }
  };

  renderTable() {
    const { filterInventoryData, listData } = this.props;
    let updatedColumnHeaders = [];

    const updatedRows = listData.map(({ ...cellData }) => {
      const { columnHeaders, cells } = inventoryListHelpers.parseRowCellsListData({
        filters: filterInventoryData,
        cellData
      });

      updatedColumnHeaders = columnHeaders;

      return {
        cells
      };
    });

    return (
      <Table
        borders
        variant={TableVariant.compact}
        className="curiosity-inventory-list"
        columnHeaders={updatedColumnHeaders}
        rows={updatedRows}
      />
    );
  }

  render() {
    const {
      cardTitle,
      error,
      filterInventoryData,
      isDisabled,
      itemCount,
      listData,
      pending,
      perPageDefault,
      productId,
      query,
      viewId
    } = this.props;

    if (isDisabled) {
      return null;
    }

    const updatedPerPage = query?.[rhsmApiTypes.RHSM_API_QUERY_LIMIT] || perPageDefault;
    const loaderPerPage = updatedPerPage / 2;

    return (
      <Card className="curiosity-inventory-card">
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h2" size="lg">
              {cardTitle}
            </Title>
          </CardTitle>
          <CardActions className={(error && 'blur') || ''}>
            <Pagination
              isCompact
              isDisabled={pending || error}
              itemCount={itemCount}
              productId={productId}
              viewId={viewId}
              itemsPerPageDefault={updatedPerPage}
            />
          </CardActions>
        </CardHeader>
        <CardBody>
          <div className={(error && 'blur') || 'fadein'}>
            {pending && (
              <Loader
                variant="table"
                tableProps={{
                  className: 'curiosity-inventory-list',
                  colCount: filterInventoryData?.length || (listData?.[0] && Object.keys(listData[0]).length) || 1,
                  rowCount: listData?.length || loaderPerPage,
                  variant: TableVariant.compact
                }}
              />
            )}
            {!pending && this.renderTable()}
          </div>
        </CardBody>
        <CardFooter className={(error && 'blur') || ''}>
          <Pagination
            isDisabled={pending || error}
            itemCount={itemCount}
            productId={productId}
            viewId={viewId}
            perPageDefault={updatedPerPage}
            dropDirection="up"
          />
        </CardFooter>
      </Card>
    );
  }
}

InventoryList.propTypes = {
  error: PropTypes.bool,
  cardTitle: PropTypes.string,
  filterInventoryData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      header: PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.string
        }),
        PropTypes.func
      ]),
      cell: PropTypes.oneOfType([
        PropTypes.shape({
          title: PropTypes.string
        }),
        PropTypes.func
      ])
    }).isRequired
  ),
  getHostsInventory: PropTypes.func,
  isDisabled: PropTypes.bool,
  itemCount: PropTypes.number,
  listData: PropTypes.array,
  pending: PropTypes.bool,
  productId: PropTypes.string.isRequired,
  perPageDefault: PropTypes.number,
  query: PropTypes.object.isRequired,
  viewId: PropTypes.string
};

InventoryList.defaultProps = {
  error: false,
  cardTitle: null,
  filterInventoryData: [],
  getHostsInventory: helpers.noop,
  isDisabled: helpers.UI_DISABLED_TABLE,
  itemCount: 0,
  listData: [],
  pending: false,
  perPageDefault: 10,
  viewId: 'inventoryList'
};

/**
 * Apply actions to props.
 *
 * @param {Function} dispatch
 * @returns {object}
 */
const mapDispatchToProps = dispatch => ({
  getHostsInventory: (id, query) => dispatch(reduxActions.rhsm.getHostsInventory(id, query))
});

/**
 * Create a selector from applied state, props.
 *
 * @type {Function}
 */
const makeMapStateToProps = reduxSelectors.inventoryList.makeInventoryList();

const ConnectedInventoryList = connect(makeMapStateToProps, mapDispatchToProps)(InventoryList);

export { ConnectedInventoryList as default, ConnectedInventoryList, InventoryList };
