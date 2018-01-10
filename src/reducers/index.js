import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import _ from 'underscore';
import {
  FETCH_SHELF_LIST_REQUEST,
  FETCH_SHELF_LIST_SUCCESS,
  FETCH_SHELF_LIST_FAILURE,
  FETCH_SHELF_REQUEST,
  FETCH_SHELF_SUCCESS,
  FETCH_SHELF_FAILURE,
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from './actions';

function shelfList(state = {}, action) {
  switch (action.type) {
    case FETCH_SHELF_LIST_REQUEST:
      return {
        ...state,
        loading: true
      };
    case FETCH_SHELF_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        items: action.shelfList
      };
    case FETCH_SHELF_LIST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error
      };
    default:
      return state;
  }
}

const defaultShelfState = {
  error: null,
  id: null,
  name: null,
  description: null,
  books: {},
  totalBooks: null,
  pagination: {
    pages: {},
    currentPage: 1,
    totalPages: null
  }
};

const defaultShelfPageState = {
  loading: true,
  ids: []
};

function bookArrayToObject(books) {
  return books.reduce((accumulator, book, i) => {
    accumulator[String(book.id)] = book;
    return accumulator;
  }, {});
}

function shelves(state = {}, action) {
  switch (action.type) {
    case FETCH_SHELF_REQUEST:
      let shelf;
      let page;
      // if we don't have a state for this shelf, create it
      if (action.shelfName in state) {
        shelf = state[action.shelfName];
      } else {
        shelf = Object.assign({}, defaultShelfState, {
          name: action.shelfName
        });
      }
      // if we don't have a state for this page, create it
      if (action.page in shelf.pagination.pages) {
        page = shelf.pagination.pages[action.page];
      } else {
        page = Object.assign({}, defaultShelfPageState);
      }

      // set to loading, and save the page on the shelf
      page.loading = true;
      shelf.pagination.pages[action.page] = page;

      return {
        ...state,
        [action.shelfName]: shelf
      };
    case FETCH_SHELF_SUCCESS:
      let booksById = bookArrayToObject(action.shelf.books);
      return {
        ...state,
        [action.shelfName]: Object.assign({}, defaultShelfState, {
          error: null,
          id: action.shelf.id,
          name: action.shelf.name,
          description: action.shelf.description,
          books: {
            ...state[action.shelfName].books,
            ...booksById
          },
          totalBooks: action.shelf.pagination.total,
          pagination: {
            pages: {
              ...state[action.shelfName].pagination.pages,
              [action.page]: {
                loading: false,
                ids: action.shelf.books.map(book => book.id)
              }
            },
            currentPage: action.page,
            totalPages: action.shelf.pagination.numpages
          }
        })
      };
    case FETCH_SHELF_FAILURE:
      return {
        ...state,
        [action.shelfName]: Object.assign({}, state[action.shelfName], {
          error: state.error,
          pagination: {
            ...state[action.shelfName].pagination,
            pages: {
              ...state[action.shelfName].pagination.pages,
              [action.page]: {
                ...state[action.shelfName].pagination.pages[action.page],
                loading: false
              }
            }
          }
        })
      };
    default:
      return state;
  }
}

export function onLastPageOfShelf(state, shelfName) {
  let shelf = state.shelves[shelfName];
  if (!shelf) {
    return false;
  }
  return shelf.pagination.currentPage >= shelf.pagination.totalPages;
}

// returns true if the shelf hasn't been fetched yet
// or if any page in the shelf is loading
export function isLoadingShelf(shelf) {
  if (!shelf) {
    return true;
  }
  return _.some(shelf.pagination.pages, page => page.loading);
}

function authReducer(state = {}, action) {
  switch (action.type) {
    case LOGIN:
      return state;
    case LOGIN_SUCCESS:
      return {
        ...state,
        jwt: action.jwt
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        jwt: null
      };
    case LOGOUT:
      return {
        ...state,
        jwt: null
      };
    default:
      return state;
  }
}

const libraryHelper = combineReducers({
  shelves,
  shelfList,
  router: routerReducer,
  auth: authReducer
});

export default libraryHelper;
