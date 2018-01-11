import _ from 'underscore';
import {
  FETCH_SHELF_REQUEST,
  FETCH_SHELF_SUCCESS,
  FETCH_SHELF_FAILURE
} from '../actions';

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
  return _.indexBy(books, 'id');
}

export default function ShelvesReducer(state = {}, action) {
  let formerShelf = state[action.shelfName];
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
            ...formerShelf.books,
            ...booksById
          },
          totalBooks: action.shelf.pagination.total,
          pagination: {
            pages: {
              ...formerShelf.pagination.pages,
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
        [action.shelfName]: Object.assign({}, formerShelf, {
          error: state.error,
          pagination: {
            ...formerShelf.pagination,
            pages: {
              ...formerShelf.pagination.pages,
              [action.page]: {
                ...formerShelf.pagination.pages[action.page],
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
