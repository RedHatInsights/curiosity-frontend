import { useHasRelation, Relation } from '../useHasRelation';

const mockCheckSelf = jest.fn();
const mockGetUser = jest.fn();

jest.mock('@project-kessel/react-kessel-access-check', () => ({
  useAccessCheckContext: () => ({})
}));

jest.mock('@project-kessel/react-kessel-access-check/core/api-client', () => ({
  checkSelf: (...args) => mockCheckSelf(...args)
}));

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    auth: { getUser: (...args) => mockGetUser(...args) }
  })
}));

describe('useHasRelation', () => {
  beforeEach(() => {
    mockCheckSelf.mockReset();
    mockGetUser.mockReset();
    mockGetUser.mockResolvedValue({
      identity: { org_id: '12345' }
    });
  });

  it('should export Relation constants', () => {
    expect(Relation.INVENTORY_VIEW).toBe('subscriptions_report_view');
  });

  it('should return authorized when checkSelf returns ALLOWED_TRUE', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = await renderHook(() => useHasRelation(Relation.INVENTORY_VIEW));

    expect(result.has).toBe(true);
    expect(result.isLoading).toBe(false);
  });

  it('should return unauthorized when checkSelf returns ALLOWED_FALSE', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_FALSE' });

    const { result } = await renderHook(() => useHasRelation(Relation.INVENTORY_VIEW));

    expect(result.has).toBe(false);
    expect(result.isLoading).toBe(false);
  });

  it('should return unauthorized when checkSelf throws', async () => {
    mockCheckSelf.mockRejectedValue(new Error('network error'));

    const { result } = await renderHook(() => useHasRelation(Relation.INVENTORY_VIEW));

    expect(result.has).toBe(false);
    expect(result.isLoading).toBe(false);
  });

  it('should return unauthorized when user does not exist', async () => {
    mockGetUser.mockResolvedValue(null);
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    const { result } = await renderHook(() => useHasRelation(Relation.INVENTORY_VIEW));

    expect(result.has).toBe(false);
    expect(result.isLoading).toBe(false);
    expect(mockCheckSelf).not.toHaveBeenCalled();
  });

  it('should call checkSelf with tenant resource using org_id', async () => {
    mockCheckSelf.mockResolvedValue({ allowed: 'ALLOWED_TRUE' });

    await renderHook(() => useHasRelation(Relation.INVENTORY_VIEW));

    expect(mockCheckSelf).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        relation: 'subscriptions_report_view',
        resource: {
          id: 'redhat/12345',
          type: 'tenant',
          reporter: { type: 'rbac' }
        }
      })
    );
  });
});
