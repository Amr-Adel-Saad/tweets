import React, { Component } from 'react';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { connect } from 'react-redux';

import Userfeed from './Userfeed';
import { logoutUser } from '../actions/userActions';
import { checkLogin } from '../actions/userActions';

class Home extends Component {
	constructor(props) {
		super();
		this.state = {
			newTweet: ''
		}
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		this.setState({ newTweet: e.target.value });

		e.target.style.height = 'auto';
		e.target.style.height = e.target.scrollHeight + 'px';
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
				<section id="new-tweet">
					<img src={this.props.user.userData.image} alt="profile" />
					<Form onSubmit={e => this.props.handleTweet(this.state.newTweet, e)}>
						<FormGroup>
							<Input
								maxLength="280"
								type="textarea"
								name="tweet"
								placeholder="What's happening ?"
								onChange={this.handleChange}
							/>
							<Button disabled={this.state.newTweet.length < 1} color="primary">
								Tweet
              </Button>
						</FormGroup>
					</Form>
				</section>
				<Userfeed />
			</main>
		);
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect(mapStateToProps, { logoutUser, checkLogin })(Home);
