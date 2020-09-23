import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Spinner } from 'reactstrap';
import axios from 'axios';

import Navigation from '../Navigation';
import { checkLogin, logoutUser } from '../../actions/userActions';

class Tweet extends Component {
  constructor(props) {
    super();
    this.state = {
      currentTweet: '',
      isLiked: false,
      isLoading: true
    };
    this.handleLike = this.handleLike.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.goBack = this.goBack.bind(this);
    this.deleteTweet = this.deleteTweet.bind(this);
  }
  
  componentDidMount() {
    this.props.checkLogin();

    axios.get(`/api/tweet/${this.props.match.params.tweetId}`)
    .then(res => {
      if (res.data.likers.includes(this.props.user.userData._id)) {
        this.setState({ 
          isLiked: true,
          currentTweet: res.data,
          isLoading: false
         })
      } else {
        this.setState({ 
          currentTweet: res.data,
          isLoading: false
        });
      }
    })
    .catch(err => console.log(err));
  }

  handleLike (tweetId, e) {
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
            this.setState({ isLiked: true });
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
            this.setState({ isLiked: false });
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

  render() {
    return (
      <div className="row">
        <Navigation
          isLogged={ this.props.user.isLogged } userData={ this.props.user.userData }
          handleLogout={ this.handleLogout } />
        <main id="current-tweet" className="col-5-5">
        {
          (this.state.isLoading)
          ? <Spinner color="primary"
              style={{
                position: "absolute",
                top: "50%",
                bottom: "50%"
              }}
            />
          : (this.state.currentTweet === '' || this.state.currentProfile === '')
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
                <div className="tweet-container">
                  {
                    (this.props.user.userData._id === this.state.currentTweet.author._id)
                    ? <Button id="delete-tweet" onClick={this.deleteTweet} className="btn-sm btn-danger">
                        <i className="far fa-trash-alt"></i> Delete
                      </Button>
                    : null
                  }
                  <img src={this.state.currentTweet.author.image} alt="current-profile"/>
                  <div className="tweet-main">
                    <span>{this.state.currentTweet.author.name}</span>
                    <div style={{ fontSize: "26px" }} className="tweet-content">
                      <p>{this.state.currentTweet.content}</p>
                      {
                        (this.state.isLiked)
                          ? <div>
                              <Button value="dislike" onClick={e => this.handleLike(this.state.currentTweet._id, e)} className="liked btn-lg">
                                <span style={{ fontSize: "16px" }} >Liked</span> <i className="fas fa-heart"></i>
                              </Button>
                              <p>{this.state.currentTweet.likes}</p>
                            </div>
                          : <div>
                              <Button value="like" onClick={e => this.handleLike(this.state.currentTweet._id, e)} className="like btn-lg">
                                <i className="fas fa-heart"></i>
                              </Button>
                              <p>{this.state.currentTweet.likes}</p>
                            </div>
                      }
                    </div>
                  </div>
                </div>
              </>
        }
        </main>
        <div className="col-3">Most liked</div>
      </div>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});


export default connect(mapStateToProps, { checkLogin, logoutUser })(Tweet);