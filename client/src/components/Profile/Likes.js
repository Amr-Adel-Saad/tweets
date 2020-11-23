import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Like from '../Like';
import { addLiked, removeLiked } from '../../actions/userActions';

class Likes extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      likes: []
    };
    this.handleLike = this.handleLike.bind(this);
  }

  componentDidMount() {
    let liked;

    if (this.props.user.userData.name === this.props.currentProfile.name) {
      liked = this.props.user.userData.likes;
    } else {
      liked = this.props.currentProfile.likes;
    }

    if (liked.length === 0) {
      this.setState({ isLoading: false });
    } else {
      const likesPromises = liked.map(tweetId => {
        return axios.get(`/api/tweet/${tweetId}`);
      });

      Promise.all(likesPromises)
        .then(responses => {
          const likes = responses.map(res => {
            res.data.createdAt = new Date(res.data.createdAt).toLocaleDateString(
              'en-gb',
              {
                day: 'numeric',
                month: 'short'
              }
            );
            return res.data;
          });
          this.setState({ isLoading: false, likes });
        })
        .catch(err =>  {
          this.setState({ isLoading: 'false' });
          console.log(err);
        });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.user.userData.image !== prevProps.user.userData.image) {
      let likes = this.state.likes;

      likes.map(tweet => {
        tweet.author.image = this.props.user.userData.image;
        return tweet;
      });

      this.setState({ likes });
    }
  }

  handleLike(tweetId, e) {
    e.persist();
    let likes = [...this.state.likes];

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
          let i = likes.findIndex(tweet => {
            return tweet._id = tweetId;
          });
          this.props.addLiked(tweetId);
          let tweet = { ...likes[i] };
          tweet.likers.push(this.props.user.userData._id);
          tweet.likes++;
          likes[i] = tweet;
          this.setState({ likes });
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
          let i = likes.findIndex(tweet => {
            return tweet._id = tweetId;
          });
          this.props.removeLiked(tweetId);
          let tweet = { ...likes[i] };
          tweet.likers.splice(tweet.likers.indexOf(this.props.user.userData._id), 1);
          tweet.likes--;
          likes[i] = tweet;
          this.setState({ likes });
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
          : (this.state.likes.length === 0)
            ? <h3>No liked tweets yet!</h3>
            : this.state.likes.map((tweet, i) => {
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

export default connect(mapStateToProps, { addLiked, removeLiked })(Likes);
