import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import { HomePage } from './HomePage';

const App = () => {
  console.log('LOGGING FROM APP.TSX ')
  return (
    <h1> Hello World  </h1>
  );
};

export { App };
