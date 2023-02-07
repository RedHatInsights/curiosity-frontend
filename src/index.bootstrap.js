import React from 'react';
import ReactDOM from 'react-dom';
import { AppEntry } from './index.appEntry';

const root = document.getElementById('root');

ReactDOM.render(<AppEntry />, root, () => root.setAttribute('data-ouia-safe', true));
