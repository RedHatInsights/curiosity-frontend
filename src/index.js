import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { routerHelpers } from './components/router';
import { store } from './redux';
import App from './components/app';
import './styles/index.scss';
import '@patternfly/react-styles/css/components/Select/select.css';

render(
  <Provider store={store}>
    <BrowserRouter basename={routerHelpers.baseName}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
