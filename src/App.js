import React from 'react';
import { BrowserRouter } from 'react-router';
import paths from '../config/paths';
import Layout from './Layout';

export default () => (
  <BrowserRouter basename={process.env.BUILD ? `/${paths.githubProject}` : undefined}>
    <Layout />
  </BrowserRouter>
);
