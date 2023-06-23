import { context, useToggleData } from '../chartContext';

describe('ChartContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for toggling chart layers', async () => {
    const mockDataSetsToggle = {};

    const mockSetDataSetsToggle = callback => {
      Object.assign(mockDataSetsToggle, callback(mockDataSetsToggle));
    };
    const mockUseChartContext = () => ({
      dataSetsToggle: [mockDataSetsToggle, mockSetDataSetsToggle]
    });

    const { result } = await renderHook(() => useToggleData({ useChartContext: mockUseChartContext }));

    result.onToggle('lorem');
    result.onToggle('lorem');
    result.onRevert();
    result.onToggle('ipsum');
    result.onHide('lorem');
    result.onToggle('ipsum');

    expect(result.getIsToggled('ipsum')).toBe(false);

    expect(mockDataSetsToggle).toMatchSnapshot('toggle data');
  });
});
