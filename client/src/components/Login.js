import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Alert, FormGroup, Input, Button, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';

import { loginUser, checkLogin } from '../actions/userActions';

class Login extends Component {
	constructor(props) {
		super();
		this.state = {
			isLoading: true,
			name: '',
			password: '',
			alert: false,
			flash: false,
			iconLoading: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		// Flash "Registered" for user if just signed up
		if (this.props.location.state && this.props.location.state.flash) {
			this.setState({ flash: true });
		}

		const decoded = jwt.decode(localStorage.getItem('userToken'));
		if (decoded) {
			axios.get(`/api/user/${decoded.userId}`, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem('userToken')}`
				}
			})
				.then(res => {
					this.props.history.push('/home');
				})
				.catch(err => {
					this.setState({ isLoading: false });
				});
		} else {
			this.setState({ isLoading: false });
		}
	}

	handleSubmit(e) {
		e.preventDefault();

		this.setState({ iconLoading: true });
		let { name, password } = this.state;
		name = name.toLowerCase();

		axios({
			method: "post",
			url: "/api/user/login",
			data: { name, password }
		})
			.then(res => {
				localStorage.setItem('userToken', res.data.token);
				// Login user and redirect to home
				this.props.loginUser(res.data.user._id);
				this.props.history.push('/home');
			})
			.catch(err => {
				console.log(err);
				if (err.response && err.response.status === 401) {
					this.setState({ alert: true, flash: false });
					this.props.history.push('/login');
					this.setState({ iconLoading: false });
				}
			});
	}

	handleChange(e) {
		// Get form data and change state
		const targetName = e.target.getAttribute('name');
		const newState = {};
		newState[targetName] = e.target.value;
		this.setState(newState);
	}

	render() {
		if (this.state.isLoading) {
			return (
				<Spinner className="loading" color="primary" />
			);
		} else {
			return (
				<main className="credentials">
					<div className="form-container">
						<h1><i className="fa fa-twitter"></i> tweets</h1>
						<Form onSubmit={this.handleSubmit} noValidate >
							<Alert color="danger" isOpen={this.state.alert} >
								Wrong username or password!
							</Alert>
							<Alert color="success" isOpen={this.state.flash} >
								<i className="fa fa-lg fa-check-circle"></i> Registered, Please log in!
							</Alert>
							<FormGroup>
								<Input
									type="text" name="name" onChange={this.handleChange}
									value={this.state.name} placeholder="Username" autoFocus autoComplete="off"/>
							</FormGroup>
							<FormGroup>
								<Input type="password" name="password" onChange={this.handleChange}
									value={this.state.password} placeholder="Password" autoComplete="off"/>
							</FormGroup>
							<Button color="primary" size="md" >
								{(this.state.iconLoading) ?
									<Spinner color="light" />
									: <span>Log in</span>}
							</Button>
						</Form>
						<p>Don't have an account? <Link to="/signup">Sign up</Link></p>
					</div>
				</main>
			);
		}
	}
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect(mapStateToProps, { loginUser, checkLogin })(Login);
