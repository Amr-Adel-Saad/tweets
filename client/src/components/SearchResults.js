import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { addFollowing, removeFollowing } from '../actions/userActions';

class Followers extends Component {
  _isMounted = true;

  constructor(props) {
    super();
    this.state = {
      isLoading: true,
      people: [],
    }
    this.handleFollow = this.handleFollow.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    axios.get(`/api/user/search/${this.props.search}`)
      .then(res => {
        if (this._isMounted) {
          this.setState({
            isLoading: false,
            people: res.data
          });
        }
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.search !== this.props.search) {
      this.setState({ isLoading: true });

      axios.get(`/api/user/search/${this.props.search}`)
        .then(res => {
          if (this._isMounted) {
            this.setState({
              isLoading: false,
              people: res.data
            });
          }
        })
        .catch(err => console.log(err));
    }
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
            : (this.state.people.length === 0)
              ? <h3>Couldn't find any results!</h3>
              : this.state.people.map((profile, i) => {
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
    );
  }
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { addFollowing, removeFollowing })(Followers);
