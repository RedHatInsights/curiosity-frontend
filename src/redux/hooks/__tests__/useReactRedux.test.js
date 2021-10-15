import { reactReduxHooks, useDispatch } from '../useReactRedux';
import { store } from '../../store';

describe('useReactRedux', () => {
  it('should return specific properties', () => {
    expect(reactReduxHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useDispatch', () => {
    const mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
    const dispatch = useDispatch();

    dispatch({
      type: 'lorem',
      data: 'ipsum'
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
    mockDispatch.mockClear();
  });
});
