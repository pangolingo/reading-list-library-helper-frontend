import React from 'react';
import { oauthUrl } from '../config';

const LoginScreen = () => (
  <div>
    <h2>Log In</h2>
    <a href={oauthUrl}>Log in with Goodreads</a>
  </div>
);

export default LoginScreen;
