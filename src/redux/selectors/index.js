import graphCardSelectors from './graphCardSelectors';
import viewSelectors from './viewSelectors';

const reduxSelectors = {
  graphCard: graphCardSelectors,
  view: viewSelectors
};

export { reduxSelectors as default, reduxSelectors };
