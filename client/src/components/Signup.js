import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Alert, FormGroup, Input, Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

import axios from 'axios';

import { checkLogin } from '../actions/userActions';

class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			email: '',
			password: '',
			password2: '',
			alert: false,
			isLoading: false,
			errors: []
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.setState({ isLoading: true });
		let { name, email, password, password2 } = this.state;
		name = name.toLowerCase();
		axios({
			method: "post",
			url: "/api/user/signup",
			data: { name, email, password, password2 }
		})
			.then(() => {
				this.props.history.push({ pathname: '/login', state: { flash: true } });
			})
			.catch(err => {
				let errors = [];
				if (err.response.status === 400) {
					errors = err.response.data.message;
				} else if (err.response.status === 409) {
					errors = [err.response.data.message];
				}
				this.setState({ alert: true, errors, isLoading: false });
				this.props.history.push('/signup');
			});
	}

	handleChange(e) {
		let targetName = e.target.getAttribute('name');
		let newState = {};
		newState[targetName] = e.target.value;
		this.setState(newState);
	}

	render() {
		return (
			<div className="credentials">
				<Form className="container" onSubmit={this.handleSubmit}>
					<h1><i className="fa fa-twitter"></i> tweets</h1>
					<FormGroup>
						<Input type="text" id="username" name="name" onChange={this.handleChange} value={this.state.name} placeholder="Username" autoFocus/>
					</FormGroup>
					<FormGroup>
						<Input type="email" id="email" name="email" onChange={this.handleChange} value={this.state.email} placeholder="Email" />
					</FormGroup>
					<FormGroup>
						<Input type="password" id="password" name="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
					</FormGroup>
					<FormGroup>
						<Input type="password" id="password2" name="password2" onChange={this.handleChange} value={this.state.password2} placeholder="Confirm Password" />
					</FormGroup>
					<Button color="primary" size="md">
						{(this.state.isLoading) ?
							<Spinner color="light" style={{ height: "20px", width: "20px" }} />
							: <span>Sign up</span>}
					</Button>
					{this.state.errors.map((error, i) =>
						<Alert className="warning" key={i} isOpen={this.state.alert} color="warning">
							{error + '!'}
						</Alert>)
					}
					<p>Have an account? <Link to="/login">Log in</Link></p>
				</Form>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { checkLogin })(Signup);