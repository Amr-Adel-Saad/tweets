import React, { Component } from 'react';
import { connect } from 'react-redux';

import Navigation from './Navigation';
import { logoutUser } from '../actions/userActions';
import { checkLogin } from '../actions/userActions';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
      userImage: ''
    }
		this.handleLogout = this.handleLogout.bind(this);
	}

	componentDidMount() {
		this.props.checkLogin();
	}
	
	handleLogout() {
		this.props.logoutUser();
		this.props.history.push('/login');
	}
	
	render() {
		return (
			<div className="row">
				<Navigation
          isLogged={ this.props.user.isLogged } userData={ this.props.user.userData }
					handleLogout={ this.handleLogout } userImage= { this.props.user.userImage } />
				<main id="home" className="col-5-5">
					<div>Home</div>
				</main>
				<div className="col-3">Most liked</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { logoutUser, checkLogin })(Home);