import { appHooks, useAppLoad } from '../useApp';

describe('useApp', () => {
  it('should return specific properties', () => {
    expect(appHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useAppLoad', async () => {
    const { result } = await renderHook(() => useAppLoad());
    expect(result()).toBe(false);
  });
});
