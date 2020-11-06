import React, { Component } from 'react';
import { Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { addFollowing, removeFollowing } from '../actions/userActions';

class TopFollowed extends Component {
  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      topFollowed: []
    }
  }

  componentDidMount() {
    axios.get('/api/user/topfollowed')
      .then(res => {
        this.setState({
          isLoading: false,
          topFollowed: res.data
        });
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
      <aside className="col-3 p-0">
        <section id="top-followed">
          <h3>Top Followed</h3>
          {
            (this.state.isLoading)
              ?
              <Spinner className="loading" color="primary" />
              : (this.state.topFollowed.length === 0)
                ? <h3>Not available</h3>
                : this.state.topFollowed.map((profile, i) => {
                  return (
                    <div className="follower-container" key={i}>
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
                    </div>
                  );
                })
          }
        </section>
      </aside>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { addFollowing, removeFollowing })(TopFollowed);
