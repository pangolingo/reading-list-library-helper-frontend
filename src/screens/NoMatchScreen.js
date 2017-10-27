import React from 'react';
import { Link } from 'react-router-dom';

const NoMatchScreen = () => (
  <div>
    <h2>404</h2>
    <Link to="/">Home</Link>
  </div>
)

export default NoMatchScreen;
