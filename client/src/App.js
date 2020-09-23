import './styles/App.scss';

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';

import Index from './components/Index';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile/Profile';
import Tweet from './components/Profile/Tweet';

import store, { history } from './store';

const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="container-fluid">
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/home" component={Home} />
            <Route path="/profile/:username/status/:tweetId" component={Tweet} />
            <Route path="/profile/:username" component={Profile} />
            <Route render={() => 
              <div id="notfound">
                <h1>404 Not found!</h1>
                <p>Oops! We couldn't find the  page you're looking for.</p>
                <div>
                  <i className="far fa-6x fa-frown"></i>
                </div>
              </div>
            } />
          </Switch>
        </div>
      </ConnectedRouter>
    </Provider>
  );
}

export default App;