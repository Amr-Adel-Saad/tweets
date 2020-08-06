import './styles/App.scss';

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';

import Index from './components/Index';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile';

import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <div className="container-fluid">
        <Router>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/profile/:username" component={Profile} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;