import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { Spinner, Alert } from 'reactstrap';
import axios from 'axios';

import Navigation from './Navigation';
import Profile from './Profile/Profile';
import Home from './Home';
import Tweet from './Tweet';
import Explore from './Explore';
import TopFollowed from './TopFollowed';

import { checkLogin, logoutUser, addTweet, removeTweet, removeLiked } from '../actions/userActions';

class Main extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      tweetModal: false,
      tweetSent: false,
      tweetDeleted: false
    }

    this.handleLogout = this.handleLogout.bind(this);
    this.goBack = this.goBack.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleTweet = this.handleTweet.bind(this);
    this.deleteTweet = this.deleteTweet.bind(this);
  }

  componentDidMount() {
    this.props.checkLogin();

    if (this.props.user.isLogged) {
      this.setState({ isLoading: false });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.user.isLogged === false && this.props.user.isLogged) {
      this.setState({ isLoading: false });
    }

    if (prevState.tweetSent === false && this.state.tweetSent === true) {
      setTimeout(() => {
        this.setState({ tweetSent: false });
      }, 4000);
    }

    if (prevState.tweetDeleted === false && this.state.tweetDeleted === true) {
      setTimeout(() => {
        this.setState({ tweetDeleted: false });
      }, 4000);
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
    e.target.querySelector('textarea').value = '';

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
        if (this.state.tweetModal === true) {
          this.toggle();
        }

        this.setState({ tweetSent: true });
        this.props.addTweet(res.data._id);
      })
      .catch(err => console.log(err));
  };

  deleteTweet(tweetId, e) {
    console.log(this.state.tweetDeleted);
    axios({
      method: 'delete',
      url: `/api/tweet/${tweetId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      },
      data: {
        userId: this.props.user.userData._id
      }
    })
      .then(res => {
        this.props.removeLiked(tweetId);
        this.props.removeTweet(tweetId);
        this.setState({ tweetDeleted: true });
        this.props.history.push(`/profile/${this.props.user.userData.name}`);
      })
      .catch(err => console.log(err));
  }

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
        <div className="row p-0 justify-content-center">
          <Navigation handleLogout={this.handleLogout} toggle={this.toggle}
            handleTweet={this.handleTweet} tweetModal={this.state.tweetModal} />
          <Switch>
            <Route path="/home"
              render={(props) => (
                <Home {...props} userData={this.props.user.userData} handleTweet={this.handleTweet} goBack={this.goBack} />
              )} />
            <Route path="/profile/:username/status/:tweetId"
              render={(props) => (
                <Tweet {...props} deleteTweet={this.deleteTweet} goBack={this.goBack} />
              )} />
            <Route path="/profile/:username"
              render={(props) => (
                <Profile {...props} handleLike={this.handleLike} goBack={this.goBack} />
              )} />
            <Route path="/explore"
              render={(props) => (
                <Explore {...props} handleLike={this.handleLike} goBack={this.goBack} />
              )} />
          </Switch>
          <TopFollowed />
          {
            (this.state.tweetSent)
              ?
              <div className="flash-tweet">
                <Alert>
                  Tweet Sent!
                </Alert>
              </div>
              : null
          }
          {
            (this.state.tweetDeleted)
              ?
              <div className="flash-tweet">
                <Alert>
                  Tweet Deleted!
                </Alert>
              </div>
              : null
          }
        </div>
      );
    }
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, {
  checkLogin, logoutUser, addTweet,
  removeTweet, removeLiked
})(Main);
