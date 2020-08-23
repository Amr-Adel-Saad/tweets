import './styles/App.scss';

import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import Index from './components/Index';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Profile from './components/Profile/Profile';

import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <div className="container-fluid">
        <Router>
          <Switch>
            <Route exact path="/" component={Index} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/home" component={Home} />
            <Route path="/profile/:username" component={Profile}/>
            <Route render={() => <h1 style={{ color: 'white' }}>Not found!</h1>} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;