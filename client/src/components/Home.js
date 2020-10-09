import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logoutUser } from '../actions/userActions';
import { checkLogin } from '../actions/userActions';

class Home extends Component {
	componentDidMount() {
		this.props.checkLogin();
	}

	render() {
		return (
			<main id="home" className="col-5-5">
				<div>Home</div>
			</main>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect(mapStateToProps, { logoutUser, checkLogin })(Home);
