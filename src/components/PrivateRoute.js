import React from 'react';
import { Route, Redirect } from 'react-router-dom'

const fakeAuth = {
  isAuthenticated: true,
}

// taken from react router docs
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    fakeAuth.isAuthenticated ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

export default PrivateRoute;