import { paginationHelpers } from '../paginationHelpers';
import { store } from '../../../redux';

describe('PaginationHelpers', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have specific functions', () => {
    expect(paginationHelpers).toMatchSnapshot('paginationHelpers');
  });

  it('should reset offset/pages through redux state', () => {
    paginationHelpers.resetPage({ productId: 'lorem', viewId: 'ipsum' });
    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch offset');
  });
});
