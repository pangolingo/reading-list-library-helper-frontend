import { push } from 'react-router-redux';

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

export function fetchShelfList(goodreadsService) {
  return function(dispatch) {
    dispatch(fetchShelfListRequest());

    goodreadsService
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

export function fetchShelf(goodreadsService, shelfName, page) {
  return function(dispatch) {
    dispatch(fetchShelfRequest(shelfName, page));

    goodreadsService
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

export default {
  fetchShelfList,
  fetchShelfListRequest,
  fetchShelfListSuccess,
  fetchShelfListFailure,

  fetchShelf,
  fetchShelfRequest,
  fetchShelfSuccess,
  fetchShelfFailure
};
