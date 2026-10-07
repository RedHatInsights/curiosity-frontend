/**
 * TypeScript types for RHSM API responses
 *
 * These types mirror the API responses from rhsm-subscriptions service
 */

/*
 * ============================================
 * Instances API Types
 * ============================================
 */

export interface Instance {
  id: string;
  instance_id: string;
  display_name: string;
  inventory_id: string;
  subscription_manager_id: string;
  last_seen: string;
  measurements: number[];
  cloud_provider?: string;
  category: 'physical' | 'virtual' | 'hypervisor' | 'cloud';
  number_of_guests: number;
  billing_provider?: string;
  billing_account_id?: string;
}

export interface InstancesData {
  data: Instance[];
  meta: {
    count: number;
    product: string;
    measurements: string[];
  };
  links: {
    first: string;
    last: string;
    previous?: string;
    next?: string;
  };
}

export interface Subscription extends Partial<Instance> {
  has_infinite_quantity?: boolean | null;
  metric_id?: string | null;
  next_event_date?: string | null;
  product_name?: string | null;
  quantity?: number | null;
  service_level?: string | null;
  total_capacity?: number | null;
}

export interface SubscriptionsData {
  data: Subscription[];
  meta: {
    count: number;
    measurements?: string[];
    product?: string;
    subscription_type?: string | null;
  };
  links?: {
    first?: string;
    last?: string;
    previous?: string;
    next?: string;
  };
}

/*
 * ============================================
 * Tally/Graph API Types
 * ============================================
 */

export interface TallySnapshot {
  date: string;
  value?: number;
  has_data: boolean;
  has_infinite_quantity?: boolean;
}

export interface TallyGraphData {
  data: TallySnapshot[];
  meta?: {
    count: number;
    product: string;
    granularity: string;
    metric_id: string;
  };
  links?: {
    first: string;
    last: string;
    previous?: string;
    next?: string;
  };
}

export type TallyGraphDataTemplate = Omit<TallyGraphData, 'data'> & {
  data: Array<Omit<TallySnapshot, 'date'>>;
};

/*
 * ============================================
 * Capacity API Types
 * ============================================
 */

export interface CapacitySnapshot {
  date: string;
  value: number;
  has_infinite_quantity: boolean;
}

export interface CapacityData {
  data: CapacitySnapshot[];
  meta?: {
    count: number;
    product: string;
  };
}

/*
 * ============================================
 * Query Parameters
 * ============================================
 */

export interface BaseQueryParams {
  granularity?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  beginning?: string;
  ending?: string;
  offset?: number;
  limit?: number;
}

export interface InstancesQueryParams extends BaseQueryParams {
  category?: string;
  sla?: string;
  usage?: string;
  billing_provider?: string;
  billing_account_id?: string;
  metric_id?: string;
  sort?: string;
  dir?: 'asc' | 'desc';
}

export interface TallyQueryParams extends BaseQueryParams {
  sla?: string;
  usage?: string;
  billing_provider?: string;
  billing_account_id?: string;
}
