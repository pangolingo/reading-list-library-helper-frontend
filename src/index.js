import React from 'react';
import {render} from 'react-dom';
import { createStore, compose, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createHistory from 'history/createBrowserHistory'
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux'
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import libraryHelper from './reducers';
import initialState from './reducers/initialState';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const myRouterMiddleware = routerMiddleware(history)

let store = createStore(
  libraryHelper,
  initialState,
  compose(
    applyMiddleware(thunk, myRouterMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
  )
)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();