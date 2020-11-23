import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware} from 'redux';
import { routerMiddleware } from 'connected-react-router';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import createRootReducer from './reducers';

export const history = createBrowserHistory();

const initialState = {};

const middleware = [thunk];

const store = createStore(
  createRootReducer(history),
  initialState,
  composeWithDevTools(
    applyMiddleware(...middleware, routerMiddleware(history))
  )
);

export default store;