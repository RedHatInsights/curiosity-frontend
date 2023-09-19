import React from 'react';
import { createRoot } from 'react-dom/client';
import { AppEntry } from './index.appEntry';

const element = document.getElementById('root');

if (element) {
  element.setAttribute('data-ouia-safe', true);
  createRoot(element).render(<AppEntry />);
}
