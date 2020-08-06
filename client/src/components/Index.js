import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function Index(props) {
  if (props.user.isLogged) {
    return (
      <Redirect to='/home' />
    )
  } else {
    return (
      <Redirect to='/login' />
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Index);