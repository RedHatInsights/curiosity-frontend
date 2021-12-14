import appMessagesSelectors from './appMessagesSelectors';
import guestsListSelectors from './guestsListSelectors';
import graphCardSelectors from './graphCardSelectors';
import inventoryListSelectors from './inventoryListSelectors';
import userSelectors from './userSelectors';

const reduxSelectors = {
  appMessages: appMessagesSelectors,
  guestsList: guestsListSelectors,
  graphCard: graphCardSelectors,
  inventoryList: inventoryListSelectors,
  user: userSelectors
};

export { reduxSelectors as default, reduxSelectors };
