import React from 'react';
import { Skeleton, SkeletonSize } from '@redhat-cloud-services/frontend-components/Skeleton';
import { Spinner } from '@redhat-cloud-services/frontend-components/Spinner';
import { TableVariant } from '@patternfly/react-table';
import { PageHeader, PageLayout } from '../pageLayout/pageLayout';
import { TableSkeleton } from '../table/tableSkeleton';

/**
 * Loading display for charts, copy, tables, etc.
 *
 * @memberof Components
 * @module Loader
 */

/**
 * Available loader types
 *
 * @type {{paragraph: string, skeleton: string, title: string, chart: string, graph: string, table: string,
 *     spinner: string}}
 */
const LoaderTypeVariants = {
  chart: 'chart',
  graph: 'graph',
  paragraph: 'paragraph',
  skeleton: 'skeleton',
  spinner: 'spinner',
  table: 'table',
  title: 'title'
};

/**
 * Render skeleton and spinner loaders.
 *
 * @param {object} props
 * @param {{ size: SkeletonSize }} [props.skeletonProps={ size: SkeletonSize.sm }]
 * @param {{ borders: boolean,
 *     className: string,
 *     colCount: number,
 *     colWidth: Array,
 *     rowCount: number,
 *     variant: TableVariant }} [props.tableProps={}]
 * @param {LoaderTypeVariants} [props.variant=LoaderTypeVariants.spinner]
 * @returns {JSX.Element}
 */
const Loader = ({
  skeletonProps = { size: SkeletonSize.sm },
  tableProps = {},
  variant = LoaderTypeVariants.spinner
}) => {
  switch (variant) {
    case 'chart':
    case 'graph':
      return (
        <div className="curiosity-skeleton-container curiosity-skeleton-container-chart">
          <Skeleton size={SkeletonSize.lg} />
          <Skeleton size={SkeletonSize.md} />
        </div>
      );
    case 'paragraph':
      return (
        <div className="curiosity-skeleton-container">
          <Skeleton size={SkeletonSize.xs} />
          <Skeleton size={SkeletonSize.sm} />
          <Skeleton size={SkeletonSize.md} />
          <Skeleton size={SkeletonSize.lg} />
        </div>
      );
    case 'skeleton':
      return <Skeleton {...skeletonProps} />;
    case 'table':
      return <TableSkeleton {...tableProps} />;
    case 'title':
      return (
        <PageLayout>
          <PageHeader>
            <Skeleton size="sm" />
          </PageHeader>
        </PageLayout>
      );
    case 'spinner':
    default:
      return <Spinner />;
  }
};

export { Loader as default, Loader, LoaderTypeVariants, SkeletonSize, TableVariant };
