import * as React from 'react';
import { Link } from 'react-router-dom';

const css = require('./GamesList.css');

export const GamesList: React.FunctionComponent = () => (
  <div>
    <Link to="/games/ships">Ships</Link>
  </div>
);
