import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';

import createRootReducer from './reducers';

export const history = createBrowserHistory();

const initialState = {};

const middleware = [thunk];

const store = createStore(
  createRootReducer(history),
  initialState,
  compose(
    applyMiddleware(...middleware, routerMiddleware(history)),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;