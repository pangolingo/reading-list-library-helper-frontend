import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import AuthReducer from './AuthReducer';
import ShelvesReducer from './ShelvesReducer';
import ShelfListReducer from './ShelfListReducer';

const libraryHelper = combineReducers({
  shelves: ShelvesReducer,
  shelfList: ShelfListReducer,
  router: routerReducer,
  auth: AuthReducer
});

export default libraryHelper;
