import { push } from 'react-router-redux';
import localForage from 'localforage';
import GoodreadsService from '../GoodreadsService';
import { apiBaseUrl } from '../config';

export const FETCH_SHELF_LIST_REQUEST = 'FETCH_SHELVES_REQUEST';
function fetchShelfListRequest() {
  return {
    type: FETCH_SHELF_LIST_REQUEST
  };
}
export const FETCH_SHELF_LIST_SUCCESS = 'FETCH_SHELVES_SUCCESS';
function fetchShelfListSuccess(shelfList) {
  return {
    type: FETCH_SHELF_LIST_SUCCESS,
    shelfList
  };
}
export const FETCH_SHELF_LIST_FAILURE = 'FETCH_SHELVES_FAILURE';
function fetchShelfListFailure(error) {
  return {
    type: FETCH_SHELF_LIST_FAILURE,
    error
  };
}

export function fetchShelfList(jwt) {
  return function(dispatch) {
    dispatch(fetchShelfListRequest());

    goodreadsService(jwt)
      .getShelves()
      .then(shelfList => {
        dispatch(fetchShelfListSuccess(shelfList));
      })
      .catch(error => {
        dispatch(fetchShelfListFailure(error));
        if (error.name === 'GoodreadsUnauthenticatedException') {
          dispatch(push('/login'));
        } else {
          throw error;
        }
      });
  };
}

export const FETCH_SHELF_REQUEST = 'FETCH_SHELF_REQUEST';
function fetchShelfRequest(shelfName, page) {
  return {
    type: FETCH_SHELF_REQUEST,
    shelfName,
    page
  };
}
export const FETCH_SHELF_SUCCESS = 'FETCH_SHELF_SUCCESS';
function fetchShelfSuccess(shelfName, page, shelf) {
  return {
    type: FETCH_SHELF_SUCCESS,
    shelfName,
    page,
    shelf
  };
}
export const FETCH_SHELF_FAILURE = 'FETCH_SHELF_FAILURE';
function fetchShelfFailure(shelfName, page, error) {
  return {
    type: FETCH_SHELF_FAILURE,
    shelfName,
    page,
    error
  };
}

function goodreadsService(jwt) {
  return new GoodreadsService(jwt, apiBaseUrl);
}

export function fetchShelf(jwt, shelfName, page) {
  return function(dispatch) {
    dispatch(fetchShelfRequest(shelfName, page));

    goodreadsService(jwt)
      .getShelf(shelfName, page)
      .then(shelf => {
        dispatch(fetchShelfSuccess(shelfName, page, shelf));
      })
      .catch(error => {
        dispatch(fetchShelfFailure(shelfName, page, error));
        if (error.name === 'GoodreadsUnauthenticatedException') {
          dispatch(push('/login'));
        } else {
          throw error;
        }
      });
  };
}

function jwtFromUrl(urlString) {
  var url = new URL(urlString);
  return url.searchParams.get('jwt');
}

export function authenticate() {
  return function(dispatch) {
    // look in url
    let jwt = jwtFromUrl(window.location.href);
    // look in local storage
    if (!jwt) {
      return localForage.getItem('jwt').then(localStorage_jwt => {
        if (localStorage_jwt) {
          dispatch(authTokenReceived(localStorage_jwt));
        } else {
          dispatch(authFailed());
          dispatch(push('/login'));
        }
      });
    } else {
      dispatch(authTokenReceived(jwt));
      return Promise.resolve(jwt);
    }
  };
}
export const AUTH_TOKEN_RECEIVED = 'AUTH_TOKEN_RECEIVED';
function authTokenReceived(jwt) {
  localForage.setItem('jwt', jwt);
  return {
    type: AUTH_TOKEN_RECEIVED,
    jwt: jwt
  };
}
export const AUTH_FAILED = 'AUTH_FAILED';
function authFailed(jwt) {
  return {
    type: AUTH_FAILED
  };
}
export const LOG_OUT = 'LOG_OUT';
function logOut() {
  return {
    type: LOG_OUT
  };
}

export default {
  fetchShelfList,
  fetchShelfListRequest,
  fetchShelfListSuccess,
  fetchShelfListFailure,

  fetchShelf,
  fetchShelfRequest,
  fetchShelfSuccess,
  fetchShelfFailure,

  authenticate,
  authTokenReceived,
  authFailed,
  logOut
};
