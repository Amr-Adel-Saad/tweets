import React, { Component } from 'react';
import { Button } from 'reactstrap';
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
				<div className="back-button-div">
          <Button onClick={this.props.goBack} className="back-button">
            <i className="fas fa-md fa-arrow-left"></i>
          </Button>
          <div>
            <h2>Home</h2>
          </div>
        </div>
			</main>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect(mapStateToProps, { logoutUser, checkLogin })(Home);
