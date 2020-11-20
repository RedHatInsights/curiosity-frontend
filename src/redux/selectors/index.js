import appMessagesSelectors from './appMessagesSelectors';
import guestsListSelectors from './guestsListSelectors';
import graphCardSelectors from './graphCardSelectors';
import inventoryListSelectors from './inventoryListSelectors';
import subscriptionsListSelectors from './subscriptionsListSelectors';
import userSelectors from './userSelectors';
import viewSelectors from './viewSelectors';

const reduxSelectors = {
  appMessages: appMessagesSelectors,
  guestsList: guestsListSelectors,
  graphCard: graphCardSelectors,
  inventoryList: inventoryListSelectors,
  subscriptionsList: subscriptionsListSelectors,
  user: userSelectors,
  view: viewSelectors
};

export { reduxSelectors as default, reduxSelectors };
