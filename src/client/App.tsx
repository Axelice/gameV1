import * as React from 'react';
import { hot } from 'react-hot-loader';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// Pages
import { Login } from './components/Login';
import { GamesList } from './components/GamesList';
import { Ships } from './components/Games/Ships';

const AppImpl = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <Route exact path='/' component={GamesList} />
        <Route path='/login' component={Login} />
        <Route exact path='/games' component={GamesList} />
        <Route exact path='/games/ships' component={Ships} />
      </Switch>
    </div>
  </BrowserRouter>
);

export const App = hot(module)(AppImpl);
