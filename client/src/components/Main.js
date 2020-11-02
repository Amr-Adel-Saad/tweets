import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Spinner } from 'reactstrap';
import axios from 'axios';

import Navigation from './Navigation';
import Profile from './Profile/Profile';
import Home from './Home';
import Tweet from './Tweet';

import { checkLogin, logoutUser, addTweet } from '../actions/userActions';

class Main extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      tweetModal: false
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.goBack = this.goBack.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTweet = this.handleTweet.bind(this);
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


  handleTweet(tweet, e) {
    e.preventDefault();

    axios({
      method: 'post',
      url: `/api/tweet/`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      },
      data: {
        content: tweet
      }
    })
      .then(res => {
        this.toggle();

        this.props.addTweet(res.data._id);
      })
      .catch(err => console.log(err));
  };

  toggle() {
    this.setState({
      tweetModal: !this.state.tweetModal
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <Spinner className="loading" color="primary" />
      );
    } else {
      return (
        <div className="row">
          <Navigation handleLogout={this.handleLogout} toggle={this.toggle}
            handleTweet={this.handleTweet} tweetModal={this.state.tweetModal} />
          <Switch>
            <Route path="/home"
              render={(props) => (
                <Home {...props} goBack={this.goBack} />
              )} />
            <Route path="/profile/:username/status/:tweetId"
              render={(props) => (
                <Tweet {...props} goBack={this.goBack} />
              )} />
            <Route path="/profile/:username"
              render={(props) => (
                <Profile {...props} handleLike={this.handleLike} goBack={this.goBack} />
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

export default connect(mapStateToProps, { checkLogin, logoutUser, addTweet })(Main);
