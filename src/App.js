import React from 'react';
import { BrowserRouter } from 'react-router';
import Layout from './Layout';

export default () => (
  <BrowserRouter basename={process.env.BUILD ? '/pbl' : undefined}>
    <Layout />
  </BrowserRouter>
);
