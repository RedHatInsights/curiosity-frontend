import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { baseName } from './components/router/routerTypes';
import { store } from './redux';
import App from './components/app';
import './styles/index.scss';

render(
  <Provider store={store}>
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
