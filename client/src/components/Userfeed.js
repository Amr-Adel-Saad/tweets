import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Like from './Like';
import { addLiked, removeLiked } from '../actions/userActions';

class Userfeed extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      userfeed: []
    }
    this.handleLike = this.handleLike.bind(this);
  }

  componentDidMount() {
    if (this.props.user.userData !== '') {
      axios({
        method: 'get',
        url: '/api/user/userfeed',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      })
        .then(res => {
          res.data = res.data.flat();
          const tweetsPromises = res.data.map(tweetId => {
            return axios.get(`/api/tweet/${tweetId}`);
          });

          Promise.all(tweetsPromises)
            .then(responses => {
              responses.sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

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

              this.setState({ isLoading: false, userfeed: tweets });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.userData !== ''
      && prevProps.user.userData.tweets !== this.props.user.userData.tweets) {
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
            userfeed: [res.data, ...this.state.userfeed]
          });
        })
        .catch(err => console.log(err));
    }

    if (prevProps.user.userData === '' && this.props.user.userData !== '') {
      axios({
        method: 'get',
        url: '/api/user/userfeed',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      })
        .then(res => {
          res.data = res.data.flat();
          const tweetsPromises = res.data.map(tweetId => {
            return axios.get(`/api/tweet/${tweetId}`);
          });

          Promise.all(tweetsPromises)
            .then(responses => {
              responses.sort((a, b) => new Date(b.data.createdAt) - new Date(a.data.createdAt));

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

              this.setState({ isLoading: false, userfeed: tweets });
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }

  handleLike(tweetId, e) {
    e.persist();
    const tweets = [...this.state.userfeed];

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
          this.setState({ userfeed: tweets });
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
          this.setState({ userfeed: tweets });
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <section id="userfeed">
        { (this.state.isLoading)
          ?
          <Spinner className="loading" color="primary" />
          : (this.state.userfeed.length === 0)
            ? <h3>No tweets available!</h3>
            : this.state.userfeed.map((tweet, i) => {
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

export default connect(mapStateToProps, { addLiked, removeLiked })(Userfeed);
