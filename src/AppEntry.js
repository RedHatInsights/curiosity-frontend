import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux';
import App from './app';
import './styles/index.scss';
import '@patternfly/react-styles/css/components/Select/select.css';

const AppEntry = () => {
  console.log('>>> APP ENTRY LOAD >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export { AppEntry as default, AppEntry };
