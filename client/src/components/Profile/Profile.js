import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { Route } from 'react-router';

import Navigation from '../Navigation';
import Links from './Links';
import Tweets from './Tweets';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import { checkLogin } from '../../actions/userActions';
import { logoutUser } from '../../actions/userActions';

class Profile extends Component {
  constructor(props) {
		super(props);
		this.state = {
			currentProfile: '',
			following: 'Follow'
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFollow = this.handleFollow.bind(this);
  }

  componentDidMount() {
		this.props.checkLogin();

		axios.get(`/api/user/profile/${this.props.match.params.username}`)
			.then(res => {
					this.setState({ currentProfile: res.data });
			})
			.catch(err => console.log(err));
	}

	static getDerivedStateFromProps(props, state) {
		if (props.user.userData.following && props.user.userData.following.includes(state.currentProfile.name)) {
			return { ...state, following: 'Followed' };
		} else {
			return null;
		}
	}

	componentDidUpdate = (prevProps) => {
    if (this.props.match.params.username !== prevProps.match.params.username ) {
      axios.get(`/api/user/profile/${this.props.match.params.username}`)
			.then(res => {
					this.setState({ currentProfile: res.data });
			})
			.catch(err => console.log(err));
		}
  };

  handleLogout() {
		this.props.logoutUser();
		this.props.history.push('/login');
	}

	handleLogin() {
		this.props.history.push('/login');
  }
  
  handleChange(e) {
		e.target.form.dispatchEvent(new Event('submit'));
	}

	handleSubmit(e) {
		e.preventDefault();
		const formData = new FormData();
		formData.append('userImage', e.target.userImage.files[0]);

		axios({
			method: 'patch',
			url: `/api/user/${this.props.user.userData._id}`,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('userToken')}`,
				'Content-Type': 'multipart/form-data'
			},
			data: formData
		})
			.then(res => {
					window.location.reload();
				})
			.catch(err => console.log(err));
	}

	handleFollow(e) {
		if (e.target.value === 'follow') {
			axios({
				method: 'patch',
				url: `/api/user/profile/${this.state.currentProfile.name}`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('userToken')}`
				},
				data: {
					type: 'follow'
				}
			})
				.then(res => {
						this.setState({ following: 'Followed' });
					})
				.catch(err => console.log(err));
		} else {
			axios({
				method: 'patch',
				url: `/api/user/profile/${this.state.currentProfile.name}`,
				headers: {
					Authorization: `Bearer ${localStorage.getItem('userToken')}`
				},
				data: {
					type: 'unfollow',
				}
			})
				.then(res => {
					this.setState({ following: 'Follow' });
					})
				.catch(err => console.log(err));
		}
	}

  render() {
    return (
      <div className="row">
        <Navigation className="col-2"
          isLogged={ this.props.user.isLogged } userData={ this.props.user.userData }
          handleLogout={ this.handleLogout } handleLogin={ this.handleLogin } />
				<section id="profile" className="col-6">
				{
					(this.state.currentProfile === '')
					?	<h2>Oops! Couldn't find username "{this.props.match.params.username}"</h2>
					:
					<>
						<div id="img-container">
							<img src={ 'http://localhost:5000' + this.state.currentProfile.image } alt="profile"/>
							<p>{this.state.currentProfile.name}</p>
							{ (() => {
								if (this.state.currentProfile.name === this.props.user.userData.name) {
									return	<Form onSubmit={this.handleSubmit}>
														<FormGroup>
														<Label htmlFor="userImage"><i className="fa fa-2x fa-camera"></i></Label>
														<Input type="file" id="userImage" title="x" name="userImage" onChange={this.handleChange} />
														</FormGroup>
													</Form>
								} else if (this.state.following === 'Followed') {
									return	<Button onMouseOver={() => {
															document.getElementById('follow').innerHTML='Unfollow'
															document.getElementById('follow').className='unfollow btn-lg'
														}}
														onMouseOut={() => {
															document.getElementById('follow').innerHTML='Followed'
															document.getElementById('follow').className='followed btn-lg'
														}}
															value="unfollow" onClick={this.handleFollow} id="follow" className="followed btn-lg">
														{this.state.following}</Button>
								} else {
									return <Button value="follow" onClick={this.handleFollow} className="follow btn-lg">
														{this.state.following}</Button>
								}
							})()
							}
						</div>
						<Links name={ this.state.currentProfile.name } />
						<Route key={this.props.match.params.username} exact path="/profile/:username" render={() => (
							<Tweets currentProfile={ this.state.currentProfile } />
						)}
						/>
						<Route path="/profile/:username/following" render={() => (
							<Following currentProfile={ this.state.currentProfile } />
						)}
						/>
						<Route path="/profile/:username/followers" render={() => (
							<Followers currentProfile={ this.state.currentProfile } />
						)}
						/>
						<Route path="/profile/:username/likes" render={() => (
							<Likes currentProfile={ this.state.currentProfile } />
						)}
						/>
      		</>
				}
				</section>
				<div className="col-3">Trending</div>
			</div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { checkLogin, logoutUser })(Profile);