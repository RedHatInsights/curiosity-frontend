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

  it('should handle SET_BANNER_MESSAGES with append', () => {
    const initialState = {
      bannerMessages: {
        test_id: [{ id: 'old' }]
      }
    };
    const action = {
      type: types.SET_BANNER_MESSAGES,
      viewId: 'test_id',
      bannerMessages: [{ id: 'new' }],
      append: true
    };
    const result = messagesReducer(initialState, action);
    expect(result.bannerMessages.test_id).toEqual([{ id: 'old' }, { id: 'new' }]);
  });
});
