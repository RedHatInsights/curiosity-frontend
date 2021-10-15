import moxios from 'moxios';
import { rhsmActionsHooks, useGetMessageReports } from '../useRhsmActions';
import { store } from '../../store';
import { rhsmApiTypes } from '../../../types/rhsmApiTypes';

describe('useRhsmActions', () => {
  beforeEach(() => {
    moxios.install();

    moxios.stubRequest(/\/(tally|capacity|hosts|subscriptions|version).*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1,
      response: {
        test: 'success',
        [rhsmApiTypes.RHSM_API_RESPONSE_PRODUCTS_DATA]: ['success']
      }
    });
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it('should return specific properties', () => {
    expect(rhsmActionsHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook and receive a response for useGetMessageReports', async () => {
    await mountHook(() => useGetMessageReports());
    const { report: nullIdReport } = store.getState().messages;
    expect(nullIdReport.fulfilled).toBe(true);
    expect(nullIdReport.metaId).toBe(null);
    expect(nullIdReport.metaQuery).toMatchObject({});

    const mockId = 'lorem';
    const mockQuery = { dolor: 'sit' };
    await mountHook(() => useGetMessageReports(mockId, mockQuery));
    const { report: mockIdReport } = store.getState().messages;
    expect(mockIdReport[mockId].fulfilled).toBe(true);
    expect(mockIdReport[mockId].metaId).toBe(mockId);
    expect(mockIdReport[mockId].metaQuery).toMatchObject(mockQuery);
  });
});
