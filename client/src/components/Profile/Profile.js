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
import { checkLogin, logoutUser, updateUserImage } from '../../actions/userActions';

class Profile extends Component {
	constructor(props) {
		super();
		this.state = {
			currentProfile: '',
			following: 'Follow',
			isLoading: true
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleFollow = this.handleFollow.bind(this);
		this.handleLike = this.handleLike.bind(this);
	}

	componentDidMount() {
		// Get profile Data
		axios.get(`/api/user/profile/${this.props.match.params.username}`)
			.then(res => {
				res.data.tweets.map(tweet => {
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
					currentProfile: res.data,
					isLoading: false
				});
			})
			.catch(err => {
				console.log(err);
				this.setState({ isLoading: false });
			});
	}

	static getDerivedStateFromProps(props, state) {
		// Check if user is following current profile
		if (props.user.userData.following
			&& props.user.userData.following.includes(state.currentProfile.name)) {
			return { following: 'Followed' };
		} else {
			return null;
		}
	}


	componentDidUpdate = (prevProps) => {
		// Reload profile data if params username changed
		if (this.props.match.params.username !== prevProps.match.params.username) {
			this.setState({ isLoading: true });
			axios.get(`/api/user/profile/${this.props.match.params.username}`)
				.then(res => {
					res.data.tweets.map(tweet => {
						tweet.createdAt = new Date(tweet.createdAt).toLocaleDateString(
							'en-gb',
							{
								day: 'numeric',
								month: 'short'
							}
						);
						return tweet;
					});
					this.setState({ currentProfile: res.data, isLoading: false });
				})
				.catch(err => console.log(err));
		}

		// Update user picture
		if (prevProps.user.userData !== this.props.user.userData) {
			if (this.props.user.userData.name === this.state.currentProfile.name) {
				this.setState({ currentProfile: this.props.user.userData });
			}
		}
	};

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

	handleLike(tweetId, e) {
		e.persist();

		let currentProfile = { ...this.state.currentProfile };

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
					e.target.parentElement.classList.add('liked');
					currentProfile.tweets.find(tweet => {
						if (tweet._id === tweetId) {
							tweet.likers.push(this.props.user.userData._id);
							tweet.likes++;
						}
						return null;
					});
					this.setState({ currentProfile: { ...currentProfile } });
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
					e.target.parentElement.classList.add('like');
					currentProfile.tweets.find(tweet => {
						if (tweet._id === tweetId) {
							tweet.likers.splice(tweet.likers.indexOf(this.props.user.userData._id));
							tweet.likes--;
						}
						return null;
					});
					this.setState({ currentProfile: { ...currentProfile } });
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
									{(() => {
										if (this.state.currentProfile.name === this.props.user.userData.name) {
											return <Form onSubmit={this.handleSubmit}>
												<FormGroup>
													<Label htmlFor="userImage">
														<i className="fa fa-2x fa-camera"></i>
													</Label>
													<Input type="file" id="userImage" title="x"
														name="userImage" onChange={this.handleChange} />
												</FormGroup>
											</Form>
										} else if (this.state.following === 'Followed') {
											return <Button onMouseOver={() => {
												document.getElementById('follow').innerHTML = 'Unfollow'
												document.getElementById('follow').className = 'unfollow btn-lg'
											}}
												onMouseOut={() => {
													document.getElementById('follow').innerHTML = 'Followed'
													document.getElementById('follow').className = 'followed btn-lg'
												}}
												value="unfollow" onClick={this.handleFollow} id="follow"
												className="followed btn-lg">
												{this.state.following}</Button>
										} else {
											return <Button value="follow" onClick={this.handleFollow}
												className="follow btn-lg">
												{this.state.following}</Button>
										}
									})()
									}
								</div>
								<Links name={this.state.currentProfile.name} />
								<Route key={this.props.match.params.username} exact
									path="/profile/:username" render={() => (
										<Tweets
											currentProfile={this.state.currentProfile}
											handleLike={this.handleLike} />
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

export default connect(mapStateToProps, { checkLogin, logoutUser, updateUserImage })(Profile);
