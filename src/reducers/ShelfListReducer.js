import {
  FETCH_SHELF_LIST_REQUEST,
  FETCH_SHELF_LIST_SUCCESS,
  FETCH_SHELF_LIST_FAILURE
} from '../actions';

export default function shelfList(state = {}, action) {
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
