import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Form, FormGroup, Label, Input } from 'reactstrap';
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
	_isMounted = false;
  constructor(props) {
		super(props);
		this.state = {
			currentProfile: ''
		};
		this.handleLogin = this.handleLogin.bind(this);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
		this._isMounted = true;

		this.props.checkLogin();

		axios.get(`/api/user/${this.props.match.params.username}`)
			.then(res => {
				if (this._isMounted) {
					this.setState({ currentProfile: res.data });
				}
			})
			.catch(err => console.log(err));
	}

	componentWillUnmount() {
    this._isMounted = false;
  }

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
			.catch(err => { console.log(err); });
	}

  render() {
    return (
      <div className="row">
        <Navigation
          isLogged={ this.props.user.isLogged } userData={ this.props.user.userData }
          handleLogout={ this.handleLogout } handleLogin={ this.handleLogin } />
				<section id="profile">
				{
					(this.state.currentProfile === null)
					?	<h2>Oops! Couldn't find username "{this.props.match.params.username}"</h2>
					:
					<>	
						<div id="img-container">
							<img src={ 'http://localhost:5000' + this.state.currentProfile.image } alt="profile"/>
							<p>{this.state.currentProfile.name}</p>
							{ (() => {
								if (this.state.currentProfile.name === this.props.user.userData.name) {
									return <Form onSubmit={this.handleSubmit}>
													<FormGroup>
													<Label htmlFor="userImage"><i className="fa fa-2x fa-camera"></i></Label>
													<Input type="file" id="userImage" title="x" name="userImage" onChange={this.handleChange} />
													</FormGroup>
												</Form>
								}
							})()
							}
						</div>
						<Links name={ this.state.currentProfile.name } />
						<Route exact path="/profile/:username" render={() => (
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
			</div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { checkLogin, logoutUser })(Profile);