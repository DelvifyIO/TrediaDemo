import React from 'react';

const Home = React.lazy(() => import('./views/Index'));
const Upload = React.lazy(() => import('./views/Upload'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/upload', exact: true, name: 'Upload RFP', component: Upload },
];

export default routes;
