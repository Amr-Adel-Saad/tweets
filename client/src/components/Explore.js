import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Button, Form, FormGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';

import Like from './Like';
import SearchResults from './SearchResults';
import { addLiked, removeLiked } from '../actions/userActions';

class Explore extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      trending: [],
      search: ''
    }
    this.handleLike = this.handleLike.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('/api/tweet/trending')
      .then(res => {
        const trending = res.data.map(tweet => {
          tweet.createdAt = new Date(tweet.createdAt).toLocaleDateString(
            'en-gb',
            {
              day: 'numeric',
              month: 'short'
            }
          );
          return tweet;
        });

        this.setState({
          isLoading: false,
          trending
        });
      })
      .catch(err => console.log(err));
  }

  handleLike(tweetId, e) {
    e.persist();
    const trending = [...this.state.trending];

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
          let i = trending.findIndex(tweet => {
            return tweet._id === tweetId;
          });
          this.props.addLiked(tweetId);
          let tweet = { ...trending[i] };
          tweet.likers.push(this.props.user.userData._id);
          tweet.likes++;
          trending[i] = tweet;
          this.setState({ trending });
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
          let i = trending.findIndex(tweet => {
            return tweet._id === tweetId;
          });
          this.props.removeLiked(tweetId);
          let tweet = { ...trending[i] };
          tweet.likers.splice(tweet.likers.indexOf(this.props.user.userData._id), 1);
          tweet.likes--;
          trending[i] = tweet;
          this.setState({ trending });
        })
        .catch(err => console.log(err));
    }
  }

  handleChange(e) {
    this.setState({
      search: e.target.value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <main id="explore" className="col-5-5">
        <div style={{ height: "65px" }} className="back-button-div">
          <Button onClick={this.props.goBack} className="back-button">
            <i className="fas fa-md fa-arrow-left"></i>
          </Button>
          <Form onSubmit={this.handleSubmit} noValidate>
            <FormGroup>
              <Input type="text" name="name" onChange={this.handleChange}
                value={this.state.search} placeholder="Search for people"
                autoComplete="off" />
              <i className="fas fa-search"></i>
            </FormGroup>
          </Form>
        </div>
        <div className="back-button-div">
          <div>
            {
              (this.state.search === '')
                ? <h2>Trending</h2>
                : <h2>People</h2>
            }
          </div>
        </div>
        <section>
          {(this.state.search !== '')
            ? <SearchResults search={this.state.search} />
            : (this.state.isLoading)
              ?
              <Spinner className="loading" color="primary" />
              : (this.state.trending.length === 0)
                ? <h3>No trending tweets yet!</h3>
                : this.state.trending.map((tweet, i) => {
                  return (
                    <div className="tweet-container" key={i}>
                      <img src={tweet.author.image} alt="current-profile" />
                      <div className="tweet-main">
                        <div className="name-date">
                          <span> {tweet.author.name}</span>
                          <span className="date">{tweet.createdAt}</span>
                        </div>
                        <p>{tweet.content}</p>
                        <Like tweet={tweet} handleLike={this.handleLike} />
                      </div>
                      <Link to={`/profile/${tweet.author.name}/status/${tweet._id}`}>
                        <span></span>
                      </Link>
                    </div>
                  );
                })
          }
        </section>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { addLiked, removeLiked })(Explore);
