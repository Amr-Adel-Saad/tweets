import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Spinner } from 'reactstrap';

import Navigation from './Navigation';
import Profile from './Profile/Profile';
import Home from './Home';
import Tweet from './Tweet';

import { checkLogin, logoutUser } from '../actions/userActions';

class Main extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true
    }
    this.handleLogout = this.handleLogout.bind(this);
		this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.props.checkLogin();
    
    if (this.props.user.isLogged) {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.isLogged === false && this.props.user.isLogged) {
      this.setState({ isLoading: false });
    }
  }
  
  goBack() {
		this.props.history.goBack();
	}

  handleLogout() {
    // Log out user
    this.props.logoutUser();
    this.props.history.push('/login');
  }

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner className="loading" color="primary" />
      );
    } else {
      return (
        <div className="row">
          <Navigation userData={this.state} handleLogout={this.handleLogout} />
          <Switch>
            <Route path="/home" component={Home}/>
            <Route path="/profile/:username/status/:tweetId" component={Tweet} />
            <Route path="/profile/:username"
              render={(props) => (
                <Profile {...props} handleLike={this.handleLike} />
              )} />
          </Switch>
          <div className="col-3">Most liked</div>
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { checkLogin, logoutUser })(Main);
