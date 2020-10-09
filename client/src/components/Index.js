import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spinner } from 'reactstrap';

import { checkLogin } from '../actions/userActions';

class Index extends Component {
  componentDidMount() {
    this.props.checkLogin();
  }

  componentDidUpdate() {
    // Redirect user to home if already logged in
    if (this.props.user.isLogged) {
      this.props.history.push('/home');
    }
  }

  render() {
    return (
      <Spinner className="loading" color="primary" />
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, { checkLogin })(Index);
