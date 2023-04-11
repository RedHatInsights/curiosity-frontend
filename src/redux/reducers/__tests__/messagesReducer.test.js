import messagesReducer from '../messagesReducer';
import { messageTypes as types } from '../../types';

describe('MessagesReducer', () => {
  it('should return the initial state', () => {
    expect(messagesReducer.initialState).toBeDefined();
  });

  it('should handle specific defined types', () => {
    const specificTypes = [types.SET_BANNER_MESSAGES];

    specificTypes.forEach(value => {
      const dispatched = {
        type: value,
        bannerMessages: ['lorem'],
        viewId: 'test_id'
      };

      const resultState = messagesReducer(undefined, dispatched);

      expect({ type: value, result: resultState }).toMatchSnapshot(`defined type ${value}`);
    });
  });
});
