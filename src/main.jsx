import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApplicationViews } from './auth/ApplicationViews.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApplicationViews />
  </React.StrictMode>
);
