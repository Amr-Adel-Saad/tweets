import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, FormGroup, Label, Input, Button, Spinner } from 'reactstrap';
import { Route } from 'react-router';
import axios from 'axios';

import Links from './Links';
import Tweets from './Tweets';
import Following from './Following';
import Followers from './Followers';
import Likes from './Likes';
import {
	checkLogin, logoutUser, updateUserImage,
	addFollowing, removeFollowing
} from '../../actions/userActions';

class Profile extends Component {
	constructor(props) {
		super();
		this.state = {
			currentProfile: '',
			isLoading: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFollow = this.handleFollow.bind(this);
	}

	componentDidMount() {
		// Get profile Data
		axios.get(`/api/user/profile/${this.props.match.params.username}`)
			.then(res => {
				this.setState({
					currentProfile: res.data,
					isLoading: false
				});
			})
			.catch(err => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	}

	componentDidUpdate = (prevProps) => {
		// Reload profile data if params username changed
		if (this.props.match.params.username !== prevProps.match.params.username) {
			this.setState({ isLoading: true });

			axios.get(`/api/user/profile/${this.props.match.params.username}`)
				.then(res => {
					this.setState({
						currentProfile: res.data,
						isLoading: false
					});
				})
				.catch(err => console.log(err));
		}

		// Update user picture
		if (this.props.user.userData.image !== prevProps.user.userData.image
			&& this.props.user.userData.name === this.props.match.params.username) {
			this.setState({ currentProfile: this.props.user.userData });
		}
	}

	handleChange(e) {
		// Submit form once a file is selected
		e.target.form.dispatchEvent(new Event('submit'));
	}

	handleSubmit(e) {
		e.preventDefault();

		const formData = new FormData();
		formData.append('userImage', e.target.userImage.files[0]);

		// Update user image
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
				this.props.updateUserImage(res.data.image);
			})
			.catch(err => console.log(err));
	}

	handleFollow(e) {
		let currentProfile = this.state.currentProfile;

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
					this.props.addFollowing(this.state.currentProfile.name);
					currentProfile.followers.push(this.props.user.userData.name);
					this.setState({ currentProfile });
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
					this.props.removeFollowing(this.state.currentProfile.name);
					let i = currentProfile.followers.indexOf(this.props.user.userData.name);
					currentProfile.followers.splice(i, 1);
					this.setState({ currentProfile });
				})
				.catch(err => console.log(err));
		}
	}

	render() {
		return (
			<main id="profile" className="col-5-5">
				{
					(this.state.isLoading)
						? <Spinner className="loading" color="primary" />
						: (this.state.currentProfile === '')
							? <h2>Oops! Couldn't find username "{this.props.match.params.username}"</h2>
							:
							<>
								<div className="back-button-div">
									<Button onClick={this.props.goBack} className="back-button">
										<i className="fas fa-md fa-arrow-left"></i>
									</Button>
									<div>
										<h2>{this.state.currentProfile.name}</h2>
										<span>{this.state.currentProfile.tweets.length} Tweets</span>
									</div>
								</div>
								<div id="img-container">
									<img src={'http://localhost:5000' + this.state.currentProfile.image}
										alt="profile" />
									<p>{this.state.currentProfile.name}</p>
									{
										(this.state.currentProfile.name === this.props.user.userData.name)
											?
											<Form onSubmit={this.handleSubmit}>
												<FormGroup>
													<Label htmlFor="userImage">
														<i className="fa fa-2x fa-camera"></i>
													</Label>
													<Input type="file" id="userImage" title="x"
														name="userImage" onChange={this.handleChange} />
												</FormGroup>
											</Form>
											: (this.props.user.userData.following.includes(this.state.currentProfile.name))
												? <Button
													value="unfollow"
													onClick={this.handleFollow}
													className="followed btn-lg">
													Following</Button>
												: <Button
													value="follow"
													onClick={this.handleFollow}
													className="follow btn-lg">
													Follow</Button>
									}
								</div>
								<Links name={this.state.currentProfile.name} />
								<Route exact path="/profile/:username"
									render={() => (
										<Tweets
											currentProfile={this.state.currentProfile} />
									)} />
								<Route path="/profile/:username/following" render={() => (
									<Following currentProfile={this.state.currentProfile} />
								)} />
								<Route path="/profile/:username/followers" render={() => (
									<Followers currentProfile={this.state.currentProfile} />
								)} />
								<Route path="/profile/:username/likes" render={() => (
									<Likes currentProfile={this.state.currentProfile} />
								)} />
							</>
				}
			</main>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect(mapStateToProps, {
	checkLogin, logoutUser, updateUserImage,
	addFollowing, removeFollowing
})(Profile);
