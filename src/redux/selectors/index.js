import graphCardSelectors from './graphCardSelectors';
import userSelectors from './userSelectors';
import viewSelectors from './viewSelectors';

const reduxSelectors = {
  graphCard: graphCardSelectors,
  user: userSelectors,
  view: viewSelectors
};

export { reduxSelectors as default, reduxSelectors };
