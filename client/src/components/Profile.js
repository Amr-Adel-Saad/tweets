import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import Navigation from './Navigation';
import { logoutUser } from '../actions/userActions';
import { checkLogin } from '../actions/userActions';

class Profile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentProfile: ''
		};
		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidMount() {
		this.props.checkLogin();

		const { match: { params } } = this.props;

		axios.get(`/api/user/${params.username}`)
			.then(res => {
				this.setState({ currentProfile: res.data });
			})
			.catch(err => console.log(err));
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.user.isLogged === false) {
			this.props.history.push('/login');
		}	
	}

	handleLogout() {
		this.props.logoutUser();
		this.props.history.push('/login');
	}

	handleLogin() {
		this.props.history.push('/login');
	}
	
	render() {
		return (
			<div id="profile">
				<Navigation
					isLogged={ this.props.user.isLogged } userData={ this.props.user.userData }
					handleLogout={ this.handleLogout } handleLogin={ this.handleLogin } />
			</div>
		);
	}
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { logoutUser, checkLogin })(Profile);