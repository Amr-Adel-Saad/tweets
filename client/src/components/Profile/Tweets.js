import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Like from '../Like';
import { addLiked, removeLiked } from '../../actions/userActions';

class Tweets extends Component {
  _isMounted = true;

  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      tweets: []
    };
    this.handleLike = this.handleLike.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    let tweets;

    if (this.props.user.userData.name === this.props.currentProfile.name) {
      tweets = this.props.user.userData.tweets;
    } else {
      tweets = this.props.currentProfile.tweets;
    }

    if (tweets.length === 0) {
      if (this._isMounted) {
        this.setState({ isLoading: false });
      }
    } else {
      const tweetsPromises = tweets.map(tweetId => {
        return axios.get(`/api/tweet/${tweetId}`);
      });

      Promise.all(tweetsPromises)
        .then(responses => {
          const tweets = responses.map(res => {
            res.data.createdAt = new Date(res.data.createdAt).toLocaleDateString(
              'en-gb',
              {
                day: 'numeric',
                month: 'short'
              }
            );
            return res.data;
          });
          if (this._isMounted) {
            this.setState({ isLoading: false, tweets });
          }
        })
        .catch(err => console.log(err));
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.userData.tweets.length !== prevProps.user.userData.tweets.length) {
      this.setState({ isLoading: true });

      axios.get(`/api/tweet/${this.props.user.userData.tweets[0]}`)
        .then(res => {
          res.data.createdAt = new Date(res.data.createdAt).toLocaleDateString(
            'en-gb',
            {
              day: 'numeric',
              month: 'short'
            }
          );

          this.setState({
            isLoading: false,
            tweets: [
              res.data,
              ...this.state.tweets
            ]
          });
        })
        .catch(err => console.log(err));
    }

    if (this.props.user.userData.image !== prevProps.user.userData.image) {
      let tweets = this.state.tweets;

      tweets.map(tweet => {
        tweet.author.image = this.props.user.userData.image;
        return tweet;
      });

      this.setState({ tweets });
    }
  }

  handleLike(tweetId, e) {
    e.persist();
    const tweets = [...this.state.tweets];

    if (e.target.parentElement.value === 'like') {
      axios({
        method: 'patch',
        url: `/api/tweet/${tweetId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        },
        data: {
          type: 'like',
          userId: this.props.user.userData._id
        }
      })
        .then(res => {
          let i = tweets.findIndex(tweet => {
            return tweet._id === tweetId;
          });
          this.props.addLiked(tweetId);
          let tweet = { ...tweets[i] };
          tweet.likers.push(this.props.user.userData._id);
          tweet.likes++;
          tweets[i] = tweet;
          this.setState({ tweets });
        })
        .catch(err => console.log(err));
    } else {
      axios({
        method: 'patch',
        url: `/api/tweet/${tweetId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        },
        data: {
          type: 'dislike',
          userId: this.props.user.userData._id
        }
      })
        .then(res => {
          let i = tweets.findIndex(tweet => {
            return tweet._id === tweetId;
          });
          this.props.removeLiked(tweetId);
          let tweet = { ...tweets[i] };
          tweet.likers.splice(tweet.likers.indexOf(this.props.user.userData._id), 1);
          tweet.likes--;
          tweets[i] = tweet;
          this.setState({ tweets });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <section>
        { (this.state.isLoading)
          ?
          <Spinner className="loading" color="primary" />
          : (this.state.tweets.length === 0)
            ? <h3>No tweets yet!</h3>
            : this.state.tweets.map((tweet, i) => {
              return (
                <article className="tweet-container" key={i}>
                  <img src={tweet.author.image} alt="current-profile" />
                  <div className="tweet-main">
                    <div className="name-date">
                      <span> {tweet.author.name}</span>
                      <span className="date">{tweet.createdAt}</span>
                    </div>
                    <p>{tweet.content}</p>
                    <Like tweet={tweet} handleLike={this.handleLike} />
                  </div>
                  <Link className="tweet-background" to={`/profile/${tweet.author.name}/status/${tweet._id}`}>
                    <span></span>
                  </Link>
                </article>
              );
            })
        }
      </section>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { addLiked, removeLiked })(Tweets);
