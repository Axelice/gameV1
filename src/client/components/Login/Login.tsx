import * as React from 'react';

const css = require('./Login.css');
const logoImg = require('../../../../assets/images/facebookLogo.png');

export const Login: React.FunctionComponent = () => (
  <div>
    <a href='/auth/facebook'>
      <img src={logoImg} className={css.logo} />
      Login with facebook
    </a>
  </div>
);
