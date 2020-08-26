import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import userReducer from './userReducer';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  user: userReducer
})
export default createRootReducer;