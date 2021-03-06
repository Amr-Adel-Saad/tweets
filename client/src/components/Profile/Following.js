import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { addFollowing, removeFollowing } from '../../actions/userActions';

class Following extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      following: []
    }
    this.handleFollow = this.handleFollow.bind(this);
  }

  componentDidMount() {
    let followingPromises;

    if (this.props.user.userData.name === this.props.currentProfile.name) {
      followingPromises = this.props.user.userData.following.map(name => {
        return axios.get(`/api/user/profile/${name}`);
      });
    } else {
      followingPromises = this.props.currentProfile.following.map(name => {
        return axios.get(`/api/user/profile/${name}`);
      });
    }

    Promise.all(followingPromises)
      .then(responses => {
        const following = responses.map(res => {
          return res.data;
        });

        this.setState({ isLoading: false, following });
      })
      .catch(err => console.log(err));
  }

  handleFollow(profile, e) {
    if (e.target.value === 'follow') {
      axios({
        method: 'patch',
        url: `/api/user/profile/${profile.name}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        },
        data: {
          type: 'follow'
        }
      })
        .then(res => {
          this.props.addFollowing(profile.name);
        })
        .catch(err => console.log(err));
    } else {
      axios({
        method: 'patch',
        url: `/api/user/profile/${profile.name}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        },
        data: {
          type: 'unfollow',
        }
      })
        .then(res => {
          this.props.removeFollowing(profile.name);
        })
        .catch(err => console.log(err));
    }
  }

  render() {
    return (
      <section>
        {
          (this.state.isLoading)
            ?
            <Spinner className="loading" color="primary" />
            : (this.state.following.length === 0)
              ? <h3>"{this.props.currentProfile.name}" doesn't follow anyone yet!</h3>
              : this.state.following.map((profile, i) => {
                return (
                  <article className="follower-container" key={i}>
                    <div>
                      <img src={profile.image} alt={profile.name} />
                      <span> {profile.name}</span>
                    </div>
                    { (this.props.user.userData.name === profile.name)
                      ? null
                      : (this.props.user.userData.following.includes(profile.name))
                        ? <Button
                          value="unfollow"
                          onClick={e => this.handleFollow(profile, e)}
                          className="followed btn-lg">
                          Following</Button>
                        : <Button
                          color="default"
                          value="follow"
                          onClick={e => this.handleFollow(profile, e)}
                          className="follow btn-lg">
                          Follow</Button>
                    }
                    <Link to={`/profile/${profile.name}`}>
                      <span></span>
                    </Link>
                  </article>
                );
              })
        }
      </section>
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { addFollowing, removeFollowing })(Following);
