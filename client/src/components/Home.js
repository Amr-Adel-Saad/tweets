import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navigation from './Navigation';
import { logoutUser } from '../actions/userActions';
import { checkLogin } from '../actions/userActions';

class Home extends Component {
	constructor(props) {
		super(props);
		this.handleLogout = this.handleLogout.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	componentDidMount() {
		this.props.checkLogin();
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
			<div id="Home">
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

export default connect(mapStateToProps, { logoutUser, checkLogin })(Home);