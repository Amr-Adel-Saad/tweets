import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Spinner } from 'reactstrap';
import axios from 'axios';

import ReplyModal from './ReplyModal';
import Replies from './Profile/Replies';
import { checkLogin, logoutUser } from '../actions/userActions';

class Tweet extends Component {
  constructor(props) {
    super();
    this.state = {
      modal: false,
      currentTweet: '',
      isLiked: false,
      isLoading: true,
      reply: ''
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.goBack = this.goBack.bind(this);
    this.deleteTweet = this.deleteTweet.bind(this);
    this.handleReply = this.handleReply.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.checkLogin();

    axios.get(`/api/tweet/${this.props.match.params.tweetId}`)
      .then(res => {
        res.data.createdAt = new Date(res.data.createdAt).toLocaleDateString(
          'en-gb',
          {
            day: 'numeric',
            month: 'short',
            weekday: 'short',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          }
        );
        this.setState({
          currentTweet: res.data,
          isLoading: false
        });
        if (res.data.likers.includes(this.props.user.userData._id)) {
          this.setState({
            isLiked: true,
          });
        }
      })
      .catch(err => console.log(err));
  }

  handleLike(tweetId, e) {
    e.persist();
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
          const currentTweet = this.state.currentTweet;
          currentTweet.likes++;
          this.setState({ currentTweet, isLiked: true });
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
          const currentTweet = this.state.currentTweet;
          currentTweet.likes--;
          this.setState({ currentTweet, isLiked: false });
        })
        .catch(err => console.log(err));
    }
  }

  handleLogout() {
    this.props.logoutUser();
    this.props.history.push('/login');
  }

  goBack() {
    this.props.history.goBack();
  }

  deleteTweet() {
    axios({
      method: 'delete',
      url: `/api/tweet/${this.state.currentTweet._id}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      },
      data: {
        userId: this.props.user.userData._id
      }
    })
      .then(res => {
        this.props.history.push(`/profile/${this.props.user.userData.name}`);
      })
      .catch(err => console.log(err));
  }

  handleReply(reply, e) {
    e.preventDefault();

    axios({
      method: 'post',
      url: `/api/tweet/${this.state.currentTweet._id}/reply`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('userToken')}`
      },
      data: {
        content: reply
      }
    })
      .then(res => {
        this.toggle();
        const currentTweet = { ...this.state.currentTweet };
        currentTweet.replies.push({
          _id: res.data._id,
          content: reply,
          author: {
            name: this.props.user.userData.name,
            image: this.props.user.userData.image
          }
        });
        this.setState({ currentTweet });
      })
      .catch(err => { console.log(err); });
  };

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    return (
      <main id="current-tweet" className="col-5-5">
        { (this.state.isLoading)
          ? <Spinner className="loading" color="primary" />
          : (this.state.currentTweet === '')
            ? <h2>Oops! Tweet not available</h2>
            :
            <>
              <div className="back-button-div">
                <Button onClick={this.goBack} className="back-button">
                  <i className="fas fa-md fa-arrow-left"></i>
                </Button>
                <div>
                  <h2>Tweet</h2>
                </div>
              </div>
              <section className="tweet-container">
                {
                  (this.props.user.userData._id === this.state.currentTweet.author._id)
                    ? <Button id="delete-tweet"
                      onClick={this.deleteTweet} className="btn-sm btn-danger">
                      <i className="far fa-trash-alt"></i>
                    </Button>
                    : null
                }
                <div>
                  <img src={this.state.currentTweet.author.image} alt="current-profile" />
                  <span style={{ fontWeight: "bold", fontSize: "20px", margin: "8px" }}>
                    {this.state.currentTweet.author.name}
                  </span>
                </div>
                <div className="tweet-main">
                  <p>{this.state.currentTweet.content}</p>
                  {
                    (this.state.isLiked)
                      ? <div className="tweet-reactions">
                        <ReplyModal
                          modal={this.state.modal}
                          reply={this.state.reply}
                          handleReply={this.handleReply}
                          toggle={this.toggle}
                          handleChange={this.handleChange}
                          tweetId={this.state.currentTweet._id} />
                        <Button value="dislike"
                          onClick={e => this.handleLike(this.state.currentTweet._id, e)}
                          className="liked btn-lg">
                          <span>liked </span>
                          <i className="fas fa-heart"></i>
                        </Button>
                      </div>
                      : <div className="tweet-reactions">
                        <ReplyModal
                          modal={this.state.modal}
                          handleReply={this.handleReply}
                          toggle={this.toggle}
                          handleChange={this.handleChange}
                          tweetId={this.state.currentTweet._id} />
                        <Button value="like"
                          onClick={e => this.handleLike(this.state.currentTweet._id, e)}
                          className="like btn-lg">
                          <i className="fas fa-heart"></i>
                        </Button>
                      </div>
                  }
                </div>
                <section className="tweet-info">
                  <span>{this.state.currentTweet.createdAt}</span>
                  <span>{this.state.currentTweet.likes} Likes</span>
                  <span>{this.state.currentTweet.replies.length} replies</span>
                </section>
              </section>
              {
                (this.state.currentTweet.replies !== '')
                  ? <Replies currentTweet={this.state.currentTweet} />
                  : null
              }
            </>
        }
      </main>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});


export default connect(mapStateToProps, { checkLogin, logoutUser })(Tweet);